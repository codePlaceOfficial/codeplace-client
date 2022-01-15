import { configureStore } from '@reduxjs/toolkit'
import sandbox  from './reducer/sandbox'
export default configureStore({
  reducer: {sandbox}
})