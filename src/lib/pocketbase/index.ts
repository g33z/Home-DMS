import Pocketbase from 'pocketbase'
import { TypedPocketBase } from './pb-types'

const pb = new Pocketbase(import.meta.env.WAKU_PUBLIC_PB_URL) as TypedPocketBase

export default pb