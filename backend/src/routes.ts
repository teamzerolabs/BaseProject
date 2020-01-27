import { Routes } from 'nest-router'
import { V1Module } from './modules/v1/v1.module'

export const routes: Routes = [
  {
    path: '/api/v1',
    module: V1Module,
  },
]
