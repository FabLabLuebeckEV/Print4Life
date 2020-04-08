import 'jasmine';
import serviceController from '../controllers/service.controller';

fdescribe('service', () => {
  it('calculate distance of ', (done) => {
    const response = serviceController.calculateDistance(1, 2);
    expect(response).toEqual(367.7304226562648);
    done();
  });
});
