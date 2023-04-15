import React, { useState, useEffect } from 'react'
import '../../../styles/subcomponents/Feed.css'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig';
import { useDispatch, useSelector } from 'react-redux';
import { SET_POSTS_LIST } from '../../../redux/types';
import { motion } from 'framer-motion'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import CloseIcon from '@material-ui/icons/Close'

function IndvPost({psts, deletePost, editPost}){

    const [expandPost, setexpandPost] = useState(false)

    return(
        <div className="div_postsIndv">
            <motion.div onClick={() => { setexpandPost(!expandPost) }} id='div_img_container' style={{backgroundImage: `linear-gradient(transparent, black), url(${psts.preview})`}}>
                <div id='div_preview_labels_container'>
                    <p className='p_labels_post'>{psts.date}</p>
                    <p className='p_labels_post'>{psts.title}</p>
                </div>
            </motion.div>
            <motion.div
            animate={{
                height: expandPost? "auto" : "calc(0px - 50px)",
                paddingTop: expandPost? "30px" : "0px",
                paddingBottom: expandPost? "20px" : "0px"
            }}
            className='div_content_expand'>
                <div className='div_postcontentheader'>
                    <p id='p_label_post_time'>Posted on {psts.time}</p>
                    <div id='div_indvPostBtns'>
                        <button title='Edit Post' id='btn_editpost' onClick={() => { editPost(psts) }}><EditIcon style={{fontSize: "15px", color: "white"}} /></button>
                        <button title='Delete Post' id='btn_deletepost' onClick={() => { deletePost(psts.postID) }}><DeleteIcon style={{fontSize: "15px", color: "white"}} /></button>
                    </div>
                </div>
                {psts.content.split("***").map((ps, i) => {
                    return(
                        <p key={i} className='p_content_post'>{ps}</p>
                    )
                })}
            </motion.div>
        </div>
    )
}

function Feed() {

  const postslist = useSelector(state => state.postslist);

  const dispatch = useDispatch()

  const [previewlink, setpreviewlink] = useState(false);

  const [contentTitle, setcontentTitle] = useState("");
  const [contentPreview, setcontentPreview] = useState("");
  const [contentParagraph, setcontentParagraph] = useState("");
  const [contentViewers, setcontentViewers] = useState("all");

  const defaultSelectedPostToEditData = {
    postID: "",
    title: "",
    preview: "",
    content: "",
    viewers: "",
    date: "",
    time: "",
  }
  const [selectedPostToEdit, setselectedPostToEdit] = useState(defaultSelectedPostToEditData);
  const [currentPostVersion, setcurrentPostVersion] = useState(defaultSelectedPostToEditData)

  const clearFields = () => {
    setcontentTitle("")
    setcontentPreview("")
    setcontentParagraph("")
    setcontentViewers("all")
  }

  useEffect(() => {
    initPosts()
  },[])

  const initPosts = () => {
    Axios.get(`${URL}/admin/getPosts`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            dispatch({ type: SET_POSTS_LIST, postslist: response.data.result })
        }
    }).catch((err) => {
        console.log(err);
    })
  }

  const postUpdates = () => {
    Axios.post(`${URL}/admin/postUpdates`, {
        title: contentTitle,
        preview: contentPreview,
        content: contentParagraph,
        viewers: contentViewers
    },{
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            clearFields()
            initPosts()
        }
    }).catch((err) => {
        console.log(err);
    })
  }

  const deletePost = (postID) => {
    if(window.confirm("Are you sure you want to delete this post?")){
        Axios.get(`${URL}/admin/deletePost/${postID}`, {
            headers:{
                "x-access-token": localStorage.getItem("token")
            }
        }).then((response) => {
            if(response.data.status){
                initPosts()
            }
        }).catch((err) => {
            console.log(err);
        })
    }
  }

  const editPost = (postData) => {
    setselectedPostToEdit(postData)
    setcurrentPostVersion(postData)
    // alert(postData.postID)
  }

  const undoPostEdit = () => {
    setselectedPostToEdit(currentPostVersion)
  }

  const isPostModified = () => {
    if(selectedPostToEdit.title.replace(/\s/g, '') != "" && selectedPostToEdit.content.replace(/\s/g, '') != ""){
        if(selectedPostToEdit.title != currentPostVersion.title || selectedPostToEdit.content != currentPostVersion.content || selectedPostToEdit.viewers != currentPostVersion.viewers){
            return true
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
  }

  const updatePostData = (newPostData) => {
    // alert(newPostData.postID)
    Axios.post(`${URL}/admin/updatePost`,{
        ...newPostData
    },{
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            //post update success
            alert(response.data.message)
            initPosts()
            setselectedPostToEdit(defaultSelectedPostToEditData)
            setcurrentPostVersion(defaultSelectedPostToEditData)
        }
        else{
            //post update failed
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  return (
    <div id='div_feedmain'>
        {selectedPostToEdit.postID != ""? (
            <div id='div_absolute_floating_edit_post_container'>
                <div id='div_main_edit_post_form_container'>
                    <div id='div_holder_edit_post_form_container'>
                        <div id='div_edit_post_header'>
                            <p id='p_edit_post_label'>Edit Post</p>
                            <button title='Delete Post' id='btn_deletepost' onClick={() => { 
                                setselectedPostToEdit(defaultSelectedPostToEditData)
                                setcurrentPostVersion(defaultSelectedPostToEditData)
                            }}><CloseIcon style={{fontSize: "15px", color: "white"}} /></button>
                        </div>
                        <div id='div_post_preview_container'>
                            <img id='img_post_preview_holder' src={selectedPostToEdit.preview} />
                        </div>
                        <div id='div_edit_post_postID_container'>
                            <span id='span_postID_holder'>{selectedPostToEdit.postID}</span>
                        </div>
                        <div id='div_edit_post_content_container'>
                            <div id='div_edit_post_title_container'>
                                <p id='p_title_label_holder'>Title</p>
                                <input value={selectedPostToEdit.title} onChange={(e) => { 
                                    setselectedPostToEdit({
                                        ...selectedPostToEdit,
                                        title: e.target.value
                                    })
                                }} type='text' id='input_post_title' className='input_forms_post_edit' placeholder="Edit Title here..." />
                            </div>
                            <div id='div_edit_post_title_container'>
                                <p id='p_title_label_holder'>Content</p>
                                <textarea value={selectedPostToEdit.content} onChange={(e) => { 
                                    setselectedPostToEdit({
                                        ...selectedPostToEdit,
                                        content: e.target.value
                                    }) 
                                }} id='textarea_content_edit' className='input_forms_post_edit' placeholder="Edit content here..." />
                            </div>
                            <div id='div_edit_post_title_container'>
                                <p id='p_title_label_holder'>Audience</p>
                                <select value={selectedPostToEdit.viewers} onChange={(e) => { 
                                    setselectedPostToEdit({
                                        ...selectedPostToEdit,
                                        viewers: e.target.value
                                    }) 
                                }} id='select_whocansee' className='input_forms_post_edit'>
                                    <option value="all">All</option>
                                    <option value="systemadmins">System Admins</option>
                                    {/* <option value="operators">Operators</option> */}
                                    <option value="drivers">Drivers</option>
                                    <option value="commuters">Commuters</option>
                                </select>
                            </div>
                            <div id='div_edit_form_btns_container'>
                                <motion.button
                                animate={{
                                    backgroundColor: isPostModified()? "lime" : "#92CA91",
                                    cursor: isPostModified()? "pointer" : "default"
                                }}
                                disabled={!isPostModified()}
                                className='btns_edit_form_actions' onClick={() => { updatePostData(selectedPostToEdit) }}>Save</motion.button>
                                <motion.button
                                animate={{
                                    backgroundColor: isPostModified()? "orange" : "#FEBF6E",
                                    cursor: isPostModified()? "pointer" : "default"
                                }}
                                disabled={!isPostModified()}
                                className='btns_edit_form_actions' onClick={() => { undoPostEdit() }}>Undo</motion.button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ) : null}
        <div id='div_newpost'>
            <p id='p_postupdatedlabel'>Post an Update</p>
            <div id='div_postupdate_form'>
                <div id='div_indv_fields'>
                    <p id='p_label_field'>Title</p>
                    <input value={contentTitle} onChange={(e) => { setcontentTitle(e.target.value) }} type='text' id='input_post_title' className='input_forms_post' placeholder="Create a Title here..." />
                </div>
                <div id='div_indv_fields'>
                    <p id='p_label_field'>Preview</p>
                    <div id="div_container_switch">
                      <label class="switch" for="checkbox">
                        <input type="checkbox" id="checkbox" checked={previewlink} onChange={(e) => { setpreviewlink(e.target.checked) }}/>
                        <div class="slider round"></div>
                      </label>
                      <span id='span_switch_label'>Use a link for preview</span>
                    </div>
                    {previewlink? (
                        <input value={contentPreview} onChange={(e) => { setcontentPreview(e.target.value) }} type='text' id='input_post_link' className='input_forms_post' placeholder="Input image link preview here" />
                    ) : (
                        <input type='file' id='input_post_file' />
                    )}
                </div>
                <div id='div_indv_fields'>
                    <p id='p_label_field'>Content</p>
                    <textarea value={contentParagraph} onChange={(e) => { setcontentParagraph(e.target.value) }} id='textarea_content' className='input_forms_post' placeholder="Type a content here..." />
                </div>
                <div id='div_indv_fields'>
                    <p id='p_label_field'>Who can see?</p>
                    <select value={contentViewers} onChange={(e) => { setcontentViewers(e.target.value) }} id='select_whocansee' className='input_forms_post'>
                        <option value="all">All</option>
                        <option value="systemadmins">System Admins</option>
                        {/* <option value="operators">Operators</option> */}
                        <option value="drivers">Drivers</option>
                        <option value="commuters">Commuters</option>
                    </select>
                </div>
                <div id='div_indv_btns'>
                    <button id='btn_confirm_post' onClick={() => { postUpdates() }}>Post</button>
                    <button id='btn_confirm_post'>Clear</button>
                </div>
            </div>
        </div>
        <div id='div_feed_posted'>
            <p id='p_postupdatedlabel'>Updates Feed</p>
            <div id='div_postslist_container'>
                {postslist.map((psts, i) => {
                    return(
                        <IndvPost key={psts.postID} psts={psts} deletePost={deletePost} editPost={editPost} />
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Feed