import {debounce} from './debounce';


describe('Debounce util', () => {

	beforeEach(() => {
		jest.useFakeTimers();
	});

	afterEach(() => {
		jest.clearAllTimers();
	});

	it('should return debounced function', () => {
		const callback = jest.fn();
		const debounced = debounce(callback, 25);

		expect(debounced).toBeInstanceOf(Function);
		expect(callback).not.toHaveBeenCalled();

		debounced();
		jest.runAllTimers();
		expect(callback).toHaveBeenCalledTimes(1);
	});

	it('should debounce within given delay', () => {
		const callback = jest.fn();
		const debounced = debounce(callback, 25);

		debounced();
		expect(callback).not.toHaveBeenCalled();

		jest.advanceTimersByTime(25);
		expect(callback).toHaveBeenCalledTimes(1);

		debounced();
		jest.advanceTimersByTime(10);
		debounced();
		jest.advanceTimersByTime(15);
		expect(callback).toHaveBeenCalledTimes(1);

		jest.advanceTimersByTime(10);
		expect(callback).toHaveBeenCalledTimes(2);
	});

	it('should call function within correct scope', () => {
		const scope = { value: 0 };
		const callback = function() { this.value++; };
		const debounced = debounce(callback, 25).bind(scope);

		debounced();
		jest.advanceTimersByTime(10);

		debounced();
		jest.advanceTimersByTime(25);

		expect(scope.value).toBe(1);
	});

});
