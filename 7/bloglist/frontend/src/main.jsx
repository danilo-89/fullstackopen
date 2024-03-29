import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';

// Store
import store from './store';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<Provider store={store}>
			<Router>
				<App />
			</Router>
		</Provider>
	</QueryClientProvider>
);
