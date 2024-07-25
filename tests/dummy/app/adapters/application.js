import OdataAdapter from 'ember-flexberry-data/adapters/odata';

export default class ApplicationAdapter extends OdataAdapter {
  namespace = 'odata';
  host = 'http://localhost:6500';

  /*pathForType(type) {
    let stype = super.pathForType(type);
    return stype.charAt(0).toUpperCase() + stype.slice(1);
  }*/
}