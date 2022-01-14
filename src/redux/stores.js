import { configureStore } from '@reduxjs/toolkit'
import virtualFile  from './reducer/virtualFile'
export default configureStore({
  reducer: {virtualFile}
})