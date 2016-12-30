import ApplicationSerializer from './application';

export default ApplicationSerializer.extend({
  attrs: {
    Creator: { deserialize: 'records' },
  },
});
