import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    Country: { serialize: 'odata-id', deserialize: 'records' },
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: 'CreatorID'
});
