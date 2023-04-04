import React, { useState, useEffect } from 'react'
import '../../../styles/subcomponents/Feed.css'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig';
import { useDispatch, useSelector } from 'react-redux';
import { SET_POSTS_LIST } from '../../../redux/types';
import { motion } from 'framer-motion'
import DeleteIcon from '@material-ui/icons/Delete'

function IndvPost({psts, deletePost}){

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
                    <button title='Delete Post' id='btn_deletepost' onClick={() => { deletePost(psts.postID) }}><DeleteIcon style={{fontSize: "15px", color: "white"}} /></button>
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

  return (
    <div id='div_feedmain'>
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
                    <textarea value={contentParagraph} onChange={(e) => { setcontentParagraph(e.target.value) }} id='textarea_content' className='input_forms_post' placeholder="Create a Title here..." />
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
                        <IndvPost key={psts.postID} psts={psts} deletePost={deletePost} />
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Feed