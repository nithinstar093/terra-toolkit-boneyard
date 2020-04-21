describe('dispatchCustomEvent', () => {
  before(() => {
    browser.url('./dispatch-custom-event.html');

    /* Setup event listener that allows us to inject a string into a paragraph. */
    browser.execute(() => {
      const eventListenerHandler = (event) => {
        const counterElement = document.getElementById('custom-event-paragraph');
        const { metaData } = event;
        const { customString } = metaData;
        counterElement.textContent = customString;
      };

      window.addEventListener('testCustomEvent', eventListenerHandler);
    });
  });

  it('correctly dispatches an event that injects a string into a paragraph', () => {
    const customString = 'inject string via custom event';
    Terra.dispatchCustomEvent('testCustomEvent', { customString });
    const actualString = $('#custom-event-paragraph').getText();
    expect(actualString).to.equal(customString);
  });
});
