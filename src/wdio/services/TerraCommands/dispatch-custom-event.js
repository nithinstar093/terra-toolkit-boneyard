const dispatchCustomEvent = (name, metaData) => {
  /* If IE support is removed, convert below to use event constructors. */
  global.browser.execute((eventName, eventMetaData) => {
    const event = document.createEvent('Event');
    event.initEvent(eventName, true, true);
    event.metaData = eventMetaData;
    window.dispatchEvent(event);
  }, name, metaData);
};

export default dispatchCustomEvent;
