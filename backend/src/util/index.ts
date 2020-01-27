/**
 * Truncates a string to maxLength, adding '...' if truncated
 *
 * @param value the value to truncate
 * @param maxLength the max length of the string
 */
import { Response } from 'express'
import { Readable } from 'stream'
import * as VError from 'verror'
import { TimeoutException } from '../errors/error-types'
import { logger } from './logger'

export function truncate(value: string, maxLength: number): string {
  if (value && value.length > maxLength) {
    return `${value.slice(0, maxLength)}...`
  }

  return value
}

export async function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id)
      reject(new Error('Timed out'))
    }, ms)

    promise
      .then((result) => {
        clearTimeout(id)
        resolve(result)
      })
      .catch((err) => {
        clearTimeout(id)
        reject(err)
      })
  })
}

export function isError(o): o is Error {
  return (
    o instanceof Error ||
    (typeof o.stack === 'string' && typeof o.message === 'string')
  )
}

/**
 * Replaces elements in an array with return value of a predicate
 *
 * @param array the array to map from
 * @param predicate function that returns a value when a replacement occurs,
 * otherwise returns undefined (or no return at all)
 */
export function replace<T>(
  array: Array<T>,
  predicate: (element: T) => T | undefined
) {
  return array.map((element) => {
    const replacement: T | undefined = predicate(element)
    if (replacement !== undefined) {
      return replacement
    } else {
      return element
    }
  })
}

export function capitalize(word: string): string {
  return word[0].toUpperCase() + word.slice(1)
}

/**
 * Polls a function and waits for it to return a non-undefined value before
 * resolving. Rejects if times out.
 *
 * @param func
 * @param rate
 * @param timeout
 */
export async function poll<T>(
  func: () => Promise<T | null>,
  rate: number,
  timeout: number
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    let stop = false

    // Note that this outer timeout executes immediately
    let timer: NodeJS.Timer = setTimeout(async function task() {
      try {
        const result = await func()
        if (!result && !stop) {
          timer = setTimeout(task, rate)
        } else if (result) {
          clearTimeout(timeoutTimer)
          resolve(result)
        }
      } catch (e) {
        reject(e)
      }
    }, 0)

    // Sets up timeout
    const timeoutTimer = setTimeout(() => {
      stop = true
      clearTimeout(timer)
      reject(new TimeoutException(`Timed out while polling`))
    }, timeout)
  })
}

/**
 * Sets up an interval via recursive setTimeout. Will make sure to finish
 * executing the given function before setting up the next timer.
 *
 * Returns a function to stop execution of this interval for cleanup.
 *
 * Errors inside the given function should not propagate out: it's not
 * obvious how to recover from this context.
 *
 * Read more here https://javascript.info/settimeout-setinterval#recursive-settimeout
 *
 * @param func
 * @param ms
 */
export function interval(func: () => Promise<void>, ms: number): () => void {
  let stop = false

  // Note that this outer timeout executes immediately
  let timer: NodeJS.Timer = setTimeout(async function task() {
    try {
      await func()
      if (!stop) {
        timer = setTimeout(task, ms)
      }
    } catch (e) {
      logger.error(
        `Unhandled error inside interval, better not to throw inside interval functions as there's no way the interval function knows how to recover
        
Caused by: ${VError.fullStack(e)}`
      )
    }
  }, 0)

  return () => {
    stop = true
    clearTimeout(timer)
  }
}

// 4 -> 2: 0,1,[2,3] 0,1

export function range(max: number, min: number = 0): number[] {
  const array: number[] = []
  for (let i = min; i < max; i++) {
    array.push(i)
  }
  return array
}

export function keyMap<T>(
  values: T[],
  keyFunc: (value: T) => number
): { [key: number]: T } {
  return values.reduce((map, value) => {
    map[keyFunc(value)] = value
    return map
  }, {})
}

export function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Returns an array with arrays of the given size.
 *
 * @param arr {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
export function chunkArray(arr: any[], chunkSize: number): any[][] {
  const results: any[] = []

  while (arr.length) {
    results.push(arr.splice(0, chunkSize))
  }

  return results
}

export function isNullOrUndefined(value: any): value is null | undefined {
  return value === undefined || value === null
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Takes a buffer and return it with the correct headers to the client
 * @param response
 * @param buffer
 * @param filename
 */
export function sendBufferResponse(
  response: Response,
  buffer: Buffer,
  filename: string
) {
  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)

  response.set({
    'Content-Type': 'application/octet-stream',
    'Content-Length': buffer.length,
    'Content-Disposition': `attachment; filename=${filename}`,
  })

  stream.pipe(response)
}
