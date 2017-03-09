import { WishfulPage } from './app.po';

describe('wishful App', function() {
  let page: WishfulPage;

  beforeEach(() => {
    page = new WishfulPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
