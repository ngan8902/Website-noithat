import { createStore } from 'redux'
import Reducer from './reducer'

const storeRedux = createStore(Reducer);

export default storeRedux;