import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    Manager: { deserialize: 'records' }
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: 'CustomerID'
});
