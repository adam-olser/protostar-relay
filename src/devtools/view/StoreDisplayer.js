import React, { useState, useEffect } from 'react';
// import dataObj from './sampleData'
import Record from './Components/Record';
import StoreTimeline from './Components/StoreTimeline'


const organizeData = (store, typename, id) => {
    //if no filter parameters are passed then no filtering necessary

    //take store and convert top level to a sorted array
    const newRecordsList = Object.keys(store)
        .map((key) => store[key])
        .sort((a, b)=>{ 
            if (a.__typename.toLowerCase() > b.__typename.toLowerCase()) return -1;
            else return 1;
        });
    return newRecordsList;
}


const StoreDisplayer = (props) => {
    const [store, setStore] = useState(props.store);
    const [recordsList, setRecordsList] = useState(store);
    const [selection, setSelection] = useState("");

    // useEffect(() => {
    //   setRecordsList(organizeData(store));
    // }, [store]);
    console.log("document", document)

    //handle type menu click events
     function handleTypeClick(e, type) {
         //set new selection
        setSelection("type-"+type);
        //update record list to current selection
         setRecordsList(
             Object.keys(store).reduce((newRL, key) => {
               if (store[key].__typename === type)
                   newRL[key] = store[key];
             return newRL;
           }, {})
         );
    }
    //handle type menu click events
    function handleIdClick(e, id) {
        //set new selection
        setSelection("id-"+id);
        //update record list to current selection
        setRecordsList(
          Object.keys(store).reduce((newRL, key) => {
              if (store[key].__id === id) newRL[key] = store[key];
            return newRL;
          }, {})
        );
    }

    function handleReset(e) {
        //remove selection
        setSelection("");
        //reset back to original store
        setRecordsList(store);
    }

    // const displayData = organizeData(dataObj);
    //https://www.artsy.net/artwork/yayoi-kusama-pumpkin-2248
    console.log("storedisplayer props", props);
    console.log("recordsList", recordsList);
    console.log("recordsList keys", Object.keys(recordsList));
    console.log("selection", selection)

    //create menu list of all types
    const menuList = {}
    for (let id in store) {
        const record = store[id];
        menuList[record.__typename] ? menuList[record.__typename].push(record.__id) : menuList[record.__typename] = [record.__id];
    }

    console.log("menuList", menuList);

    //loop through each type and generate new link
    const typeList = [];
    for (let type in menuList) {
        const idList = menuList[type].map(id => {
            return (
                <li>
                    <a id={"id-" + id} className={(selection === ("id-"+id)) && "is-active"} onClick={(e) => {handleIdClick(e, id)}}>{id}</a>
                </li>
            )
        })

        typeList.push(
          <li>
                <a id={"type-" + type} className={(selection === ("type-"+type)) && "is-active"} onClick={(e) => {handleTypeClick(e, type)}}>
              {type}
            </a>
            <ul>{idList}</ul>
          </li>
        );
    }

    return (
        <React.Fragment>
        <div className="column">
            <button className="button is-link" onClick={(e)=>{handleReset(e)}}>Reset</button>
            <aside className="menu">
            <p className="menu-label">
                Record List
            </p>
            <ul className="menu-list" id="menu">
                {typeList}
            </ul>
            </aside>
        </div>
        <div className="column">
            <div className="display-box">
            <ul>
                <Record {...recordsList} />
            </ul>
            </div>
        </div>
        <div className="column">
          <StoreTimeline store={props.store} />
        </div>
        
        </React.Fragment>
    );
}

export default StoreDisplayer;
