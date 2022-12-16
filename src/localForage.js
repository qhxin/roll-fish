import localforage from 'localforage';


localforage.config({
    driver      : localforage.INDEXEDDB,
    name        : 'roll-fish',
    version     : 1.0,
    size        : 1024*1024*100,
    storeName   : 'local_fish',
    description : 'local save fish record',
});


export default localforage;