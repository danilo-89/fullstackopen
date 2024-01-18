import { useDispatch } from 'react-redux';

// Reducers
import { filterChange } from '../reducers/filterReducer';

const style = {
	marginBottom: 10,
};

const Filter = () => {
	const dispatch = useDispatch();

	const handleChange = (event) => {
		// input-field value is in variable event.target.value
		const value = event.target.value;
		console.log(value);
		dispatch(filterChange(value));
	};

	return (
		<div style={style}>
			filter <input onChange={handleChange} />
		</div>
	);
};

export default Filter;
