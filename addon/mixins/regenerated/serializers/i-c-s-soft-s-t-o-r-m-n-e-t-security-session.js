import Mixin from '@ember/object/mixin';

export let Serializer = Mixin.create({
  attrs: {
  },

  /**
    Field name where object identifier is kept.
  */
  primaryKey: '__PrimaryKey',
});
