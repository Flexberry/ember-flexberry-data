import ApplicationSerializer from './application';

// TODO: ODataSerializer.extend
export default ApplicationSerializer.extend({
  attrs: {
    Country: { deserialize: 'records' },
    Manager: { deserialize: 'records' },
    Creator: { deserialize: 'records' },
    Tags: { deserialize: 'records' },
  },

  /**
    Property name in which object identifier is kept.
   */
  primaryKey: 'EmployeeID'
});
