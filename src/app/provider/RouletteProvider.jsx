import { Provider } from 'react-redux'
import { store } from '../store'

const RouletteProvider = ({ children }) => {
	return <Provider store={store}>{children}</Provider>
}

export default RouletteProvider
