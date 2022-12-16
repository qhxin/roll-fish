import localforage from '../localForage';
import React, { useState, useEffect, useRef, useCallback } from "react";
import styled from '@emotion/styled';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LearnProcess from './LearnProcess';
import { booksMap, LOCAL_SAVE } from '../meta';
import _ from 'lodash';

const { initSqlJs } = window;


const FlexBase = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
`;

const PlanTitle = styled.h1`
    text-align: center;
`;

const FormLimit = styled.div`
    width: 80%;
    margin: 0 auto;
`;

const FormControlLine = styled(FormControl)`
    margin-bottom: 26px;
`;


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
                    // console.log(value);
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

    const handleExec = useCallback((sql, params, callback) => {
        let res = false;
        try {
            // console.log(`run ${sql}`);
            res = db.exec(sql, params);
            // Save db
            // 每次sql执行都保存，不想考虑太多了
            if (!(sql.toUpperCase().indexOf('SELECT') === 0)) {
                (async () => {
                    try {
                        await localforage.setItem(LOCAL_SAVE, db.export());
                    } catch (e) {
                        alert('学习进度本地保存失败！');
                    }
                })();
            }

            setError(null);
        } catch (err) {
            setError(err);
        }
        if (typeof callback === 'function') {
            callback(res);
        }
    }, [db]);

    const [inProcess, setInProcess] = useState(false);
    const [learnCount, setLearnCount] = useState(10);
    const [learnBook, setLearnBook] = useState(booksMap[0][0]);
    const [learnProcess, setLearnProcess] = useState({});

    useEffect(() => {
        if (db && typeof handleExec === 'function' && !inProcess) {
            let sql = '';
            _.each(booksMap, (line) => {
                const book = line[0];
                sql += `SELECT count(*), status from ${book} GROUP BY status;\n`;
            });

            handleExec(sql, undefined, (result) => {
                const record = {};
                _.each(result, ({ columns, values }, i) => {
                    const mp = {};
                    _.each(values, line => {
                        mp[`${line[1]}`] = line[0];
                    });
                    record[booksMap[i][0]] = mp;
                });
                setLearnProcess(record);
            })
        }
    }, [db, handleExec, inProcess]);

    if (error) return <pre>{error.toString()}</pre>;
    else if (!db) return <pre>Loading...</pre>;

    if (inProcess) {
        return (
            <LearnProcess
                key={`${learnBook}-${learnCount}`}
                learnCount={learnCount}
                learnBook={learnBook}
                handleExec={handleExec}
                handleEnd={() => setInProcess(false)}
            />
        );
    }

    return (
        <div>
            <PlanTitle>制定学习计划</PlanTitle>
            <FormLimit>
                <FormControlLine fullWidth>
                    <InputLabel id="learn-book-select-label">选择学习词库</InputLabel>
                    <Select
                        labelId="learn-book-select-label"
                        id="learn-book-select"
                        value={learnBook}
                        label="选择学习词库"
                        onChange={e => setLearnBook(e.target.value)}
                    >
                        {booksMap.map((line) => {
                            const process = learnProcess[line[0]];
                            const show = process ? (
                                learnProcess[line[0]]['1'] > 0 ?
                                    `${learnProcess[line[0]]['1']} / ${learnProcess[line[0]]['0']}`:
                                    `${learnProcess[line[0]]['0']}` 
                            ) : '';

                            return (
                                <MenuItem key={line[0]} value={line[0]}>
                                    <FlexBase>
                                        <div>{line[1]}</div>
                                        <div>{show}</div>
                                    </FlexBase>
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControlLine>
                <FormControlLine fullWidth>
                    <InputLabel id="learn-count-select-label">本轮学习数量</InputLabel>
                    <Select
                        labelId="learn-count-select-label"
                        id="learn-count-select"
                        value={learnCount}
                        label="本轮学习数量"
                        onChange={e => setLearnCount(e.target.value)}
                    >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                    </Select>
                </FormControlLine>
                <FormControlLine fullWidth>
                    <Button fullWidth onClick={() => setInProcess(true)} variant="contained">开始学英语</Button>
                </FormControlLine>
            </FormLimit>
        </div>
    );
};

export default LearnWords;
