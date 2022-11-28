import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from '@emotion/styled';

const { initSqlJs } = window;

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

                const sqlPromise = initSqlJs({ locateFile: () => `db/sql-wasm.wasm` });
                const dataPromise = fetch("db/inami.db").then(res => res.arrayBuffer());
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

    const handleExec = useCallback((sql) => {
        try {
            // The sql is executed synchronously on the UI thread.
            // You may want to use a web worker here instead
            setResults(db.exec(sql)); // an array of objects is returned
            setError(null);
        } catch (err) {
        // exec throws an error when the SQL statement is invalid
            setError(err);
            setResults([]);
        }
    }, [db]);
  
    if (error) return <pre>{error.toString()}</pre>;
    else if (!db) return <pre>Loading...</pre>;

    return (
        <div>
            Learn

            <button onClick={() => { handleExec(`SELECT * from CET4_1 WHERE status = 0 LIMIT 0,10`) }}>test</button>
        </div>
    );
};

export default LearnWords;
