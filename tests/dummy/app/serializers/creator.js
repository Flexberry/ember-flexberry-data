import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    Country: { deserialize: 'records' },
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: 'CreatorID'
});
