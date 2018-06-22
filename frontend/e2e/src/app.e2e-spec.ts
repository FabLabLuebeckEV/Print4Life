import { AppPage } from './app.po';

import 'jasmine';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    page.getParagraphText().then(result => {
      expect(result).toEqual('Welcome to app!');
    });
  });
});
