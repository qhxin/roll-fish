import localforage from 'localforage';
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from '@emotion/styled';

const { initSqlJs } = window;

localforage.config({
    driver      : localforage.INDEXEDDB,
    name        : 'roll-fish',
    version     : 1.0,
    size        : 1024*1024*100,
    storeName   : 'local_fish',
    description : 'local save fish record',
});

const LOCAL_SAVE = 'roll-fish-db';

const LearnWords = () => {
    const [db, setDb] = useState(null);
    const [error, setError] = useState(null);
    const lockRef = useRef(false);
  
    useEffect(() => {
        (async () => {
            try {
                if (lockRef.current) {
                    return;
                }
                lockRef.current = true;

                // read local
                let localDB;
                try {
                    const value = await localforage.getItem(LOCAL_SAVE);
                    console.log(value);
                    localDB = value;
                } catch (err) {
                    console.log(err);
                    alert('学习进度本地读取失败！请尝试清理缓存！');
                }

                const sqlPromise = initSqlJs({ locateFile: () => `db/sql-wasm.wasm` });
                let dataPromise;
                if (localDB) {
                    const readInitDB = () => {
                        return new Promise((resolve) => {
                            resolve(localDB)
                        });
                    }
                    dataPromise = readInitDB();
                } else {
                    dataPromise = fetch("db/inami.db").then(res => res.arrayBuffer());
                }
                const [SQL, buf] = await Promise.all([sqlPromise, dataPromise]);
                const loadDB = new SQL.Database(new Uint8Array(buf));

                setDb(loadDB);
            } catch (err) {
                setError(err);
                lockRef.current = false;
            }
        })();
    }, []);

    const setResults = (...args) => {
        console.log(...args);
    };

    const handleExec = useCallback((sql, callback) => {
        let res = false;
        try {
            res = db.exec(sql);
            // save db
            (async () => {
                try {
                    await localforage.setItem(LOCAL_SAVE, db.export());
                } catch (e) {
                    alert('学习进度本地保存失败！');
                }
            })();

            setError(null);
        } catch (err) {
            setError(err);
        }
        if (typeof callback === 'function') {
            callback(res);
        }
    }, [db]);
  
    if (error) return <pre>{error.toString()}</pre>;
    else if (!db) return <pre>Loading...</pre>;

    return (
        <div>
            Learn

            <button onClick={() => { handleExec(`SELECT * from CET4_1 WHERE status = 0 LIMIT 0,10`, setResults) }}>test</button>
        </div>
    );
};

export default LearnWords;
