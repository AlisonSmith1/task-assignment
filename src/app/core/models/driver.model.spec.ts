import { Driver } from './driver.model';

describe('Driver', () => {
  it('should have a type definition', () => {
    const driver: Driver = {
      id: 1,
      name: 'Test Driver',
      tasks: []
    };
    expect(driver).toBeTruthy();
  });
});
