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
		class Scoped {
			value = 0;
			debounced: () => void;

			constructor() {
				this.debounced = debounce(this.callback.bind(this), 25);
			}

			callback() {
				this.value++;
			}
		}

		const scope = new Scoped();
		scope.debounced();

		jest.advanceTimersByTime(10);

		scope.debounced();
		jest.advanceTimersByTime(25);

		expect(scope.value).toBe(1);
	});

	it('should call function with correct parameters', () => {
		const callback = jest.fn();
		const debounced = debounce(callback, 25);

		debounced(42, 'foo', 'bar');
		jest.advanceTimersByTime(25);
		expect(callback).toHaveBeenCalledTimes(1);
		expect(callback).toHaveBeenCalledWith(42, 'foo', 'bar');
	});

});
