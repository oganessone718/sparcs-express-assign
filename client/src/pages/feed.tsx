import React, { useEffect } from "react";
import axios from "axios";
import { SAPIBase } from "../tools/api";
import Header from "../components/header";
import "./css/feed.css";

interface IAPIResponse  { _id: string, title: string, content: string, itemViewCnt: number }

const FeedPage = (props: {}) => {
  const [ LAPIResponse, setLAPIResponse ] = React.useState<IAPIResponse[]>([]);
  const [ NPostCount, setNPostCount ] = React.useState<number>(0);
  const [ EditedId, setEditedId ] = React.useState<string>();
  const [ Key, setKey ] = React.useState<number>();
  const [ Edited, setEdited ] = React.useState<boolean>(false);
  const [ EditedTitle, setEditedTitle ] = React.useState<string>();
  const [ EditedContent, setEditedContent ] = React.useState<string>();
  const [ SNewPostTitle, setSNewPostTitle ] = React.useState<string>("");
  const [ SNewPostContent, setSNewPostContent ] = React.useState<string>("");
  const [ SSearchItem, setSSearchItem ] = React.useState<string>("");
  const [ Body, setBody] = React.useState<JSX.Element[]>();

  React.useEffect( () => {
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/feed/getFeed?count=${ NPostCount }&search=${ SSearchItem }`);
      console.log(data);
      // const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }, [ NPostCount, SSearchItem]);

  const afterEdit = ()=>{
    let BComponentExited = false;
    const asyncFun = async () => {
      const { data } = await axios.get<IAPIResponse[]>( SAPIBase + `/feed/getFeed?count=${ NPostCount }&search=${ SSearchItem }`);
      console.log(data);
      // const data = [ { id: 0, title: "test1", content: "Example body" }, { id: 1, title: "test2", content: "Example body" }, { id: 2, title: "test3", content: "Example body" } ].slice(0, NPostCount);
      if (BComponentExited) return;
      setLAPIResponse(data);
    };
    asyncFun().catch((e) => window.alert(`Error while running API Call: ${e}`));
    return () => { BComponentExited = true; }
  }

  React.useEffect(afterEdit,[Edited])

  const createNewPost = () => {
    const asyncFun = async () => {
      await axios.post( SAPIBase + '/feed/addFeed', { title: SNewPostTitle, content: SNewPostContent } );
      setNPostCount(NPostCount + 1);
      setSNewPostTitle("");
      setSNewPostContent("");
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const deletePost = (id: string) => {
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/feed/deleteFeed', { id: id } );
      setNPostCount(Math.max(NPostCount - 1, 0));
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
  }

  const editPost = (id: string, title: string, content: string, i:number) => {
    setEditedId(id);
    setKey(i);
    setEditedTitle(title);
    setEditedContent(content);
    setEdited(true);
  }

  const editDonePost = ()=>{
    
    const asyncFun = async () => {
      // One can set X-HTTP-Method header to DELETE to specify deletion as well
      await axios.post( SAPIBase + '/feed/editFeed', { id: EditedId , title: EditedTitle, content: EditedContent} );
    }
    asyncFun().catch(e => window.alert(`AN ERROR OCCURED! ${e}`));
    setEdited(false);
  }

  if(Edited){
    return (
      <div className="Feed">
        <Header/>
        <h2>Feed</h2>
        <div className={"feed-length-input"}>
          Number of posts to show: &nbsp;&nbsp;
          <input type={"number"} value={ NPostCount } id={"post-count-input"} min={0}
                onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
          />
        </div>
        <div className={"feed-length-input"}>
          Search Keyword: &nbsp;&nbsp;
          <input type={"text"} value={ SSearchItem } id={"post-search-input"}
                onChange={ (e) => setSSearchItem( e.target.value ) }
          />
        </div>
        <div className={"feed-list"}>
          {
            LAPIResponse.filter((val, i)=> ( i == Key)).map( (val,i) =>
            <div className={"feed-item-edit"}>
              <h4>How to edit?</h4>
              Title: <input type={"text"} value={EditedTitle} onChange={(e) => setEditedTitle(e.target.value)}/>
              &nbsp;&nbsp;&nbsp;&nbsp;
              Content: <input type={"text"} value={EditedContent} onChange={(e) => setEditedContent(e.target.value)}/>
              <div className={"post-add-button"} onClick={(e) => editDonePost()}>done</div>
            </div>
            )
          }
          { LAPIResponse.filter((val, i)=> ( i != Key)).map( (val, i) =>
            <div key={i} className={"feed-item"}>
              <div className={"delete-item"} onClick={(e) => deletePost(`${val._id}`)}>ⓧ</div>
              <div className={"edit-item"} onClick={(e) => editPost(`${val._id}`, `${val.title}`, `${val.content}`, i)}>EDIT</div>
              <h3 className={"feed-title"}>{ val.title }</h3>
              <p className={"feed-body"}>{ val.content }</p>
            </div>
          ) }
          <div className={"feed-item-add"}>
            Title: <input type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            Content: <input type={"text"} value={SNewPostContent} onChange={(e) => setSNewPostContent(e.target.value)}/>
            <div className={"post-add-button"} onClick={(e) => createNewPost()}>Add Post!</div>
          </div>
        </div>
      </div>
    );
  }else{
    return (
      <div className="Feed">
        <Header/>
        <h2>Feed</h2>
        <div className={"feed-length-input"}>
          Number of posts to show: &nbsp;&nbsp;
          <input type={"number"} value={ NPostCount } id={"post-count-input"} min={0}
                onChange={ (e) => setNPostCount( parseInt(e.target.value) ) }
          />
        </div>
        <div className={"feed-length-input"}>
          Search Keyword: &nbsp;&nbsp;
          <input type={"text"} value={ SSearchItem } id={"post-search-input"}
                onChange={ (e) => setSSearchItem( e.target.value ) }
          />
        </div>
        <div className={"feed-list"}>
          { LAPIResponse.map( (val, i) =>
            <div key={i} className={"feed-item"}>
              <div className={"delete-item"} onClick={(e) => deletePost(`${val._id}`)}>ⓧ</div>
              <div className={"edit-item"} onClick={(e) => editPost(`${val._id}`, `${val.title}`, `${val.content}`, i)}>EDIT</div>
              <h3 className={"feed-title"}>{ val.title }</h3>
              <p className={"feed-body"}>{ val.content }</p>
            </div>
          ) }
          <div className={"feed-item-add"}>
            Title: <input type={"text"} value={SNewPostTitle} onChange={(e) => setSNewPostTitle(e.target.value)}/>
            &nbsp;&nbsp;&nbsp;&nbsp;
            Content: <input type={"text"} value={SNewPostContent} onChange={(e) => setSNewPostContent(e.target.value)}/>
            <div className={"post-add-button"} onClick={(e) => createNewPost()}>Add Post!</div>
          </div>
        </div>
      </div>
    );
  }

  
}

export default FeedPage;