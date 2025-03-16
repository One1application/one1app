import React, { useEffect, useState } from 'react'
import { useStore } from '../../../../../context/StoreContext/StoreState';
import { Button, Menu, MenuItem } from "@mui/material";
import { MySwitch } from "./SocialLinks";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


const AddLinks = ({ item, index }) => {
    const { header, setHeader, setLinks, links } = useStore();
    const [showMenu, setShowMenu] = useState(null);
    const [linkTitle, setlinkTitle] = useState("");
    const [linkValue, setlinkValue] = useState("");
    const [isHeaderEdit, setIsHeaderEdit] = useState(false);
    const open = Boolean(showMenu)

    const updateLink = (index, changes) => {
        const updatedLinks = links.map((link, i) =>
            i === index ? { ...link, ...changes } : link
        );
        setLinks(updatedLinks);
    };

    const handleLinkSave = (i) => {
        updateLink(i, { title: linkTitle, url: linkValue });
    };

    const handleLinkToggle = (i) => {
        updateLink(i, { enabled: !links[i].enabled });
    };

    const handleDeleteLink = (i) => {
        const updatedLinks = links.filter((_, index) => index !== i);
        setLinks(updatedLinks);
    };

    useEffect(() => {
        setlinkTitle(item?.title);
        setlinkValue(item?.url);
    }, [item])

    return (
        <>
            <div
                key={index}
                className="social-link-item mb-3 p-3 items-start"
            >
                <div>
                    <div className="social-info w-full">
                        <span>{item.title}</span>
                    </div>
                    <span className='text-sm text-primary'>{item.url}</span>
                </div>


                <div className='edit-right-section'>
                    {!isHeaderEdit && <EditOutlinedIcon className="editIcon" onClick={() => setIsHeaderEdit(true)} />}
                    <div className="toggle-switch">
                        <MySwitch checked={item?.enabled}
                            onChange={() => handleLinkToggle(index)} />
                    </div>
                    <div className="menu-item">
                        <MoreVertIcon
                            id="basic-button"
                            aria-controls={open ? 'basic-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={(e) => setShowMenu(e.currentTarget)}
                        />
                        <Menu
                            id="basic-menu"
                            anchorEl={showMenu}
                            open={open}
                            onClose={() => setShowMenu(null)}
                            MenuListProps={{
                                'aria-labelledby': 'basic-button',
                            }}
                        >
                            <MenuItem color="danger" onClick={() => {
                                handleDeleteLink(index)
                                setShowMenu(null)
                            }}>Delete</MenuItem>
                        </Menu>
                    </div>
                </div>
            </div>
            {isHeaderEdit && <div
                key={1}
                className="social-link-item mb-5"
            >
                <div class="flex  flex-col w-full">
                    <div class="basis-1/2 my-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={linkTitle}
                            onChange={({ target }) => setlinkTitle(target.value)}
                            placeholder="Enter title"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none text-sm"
                        />
                    </div>
                    <div class="basis-1/2 my-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Link
                        </label>
                        <input
                            type="text"
                            value={linkValue}
                            onChange={({ target }) => setlinkValue(target.value)}
                            placeholder="Enter link"
                            className="w-full border border-gray-300 rounded-lg p-2 focus:ring focus:ring-blue-200 focus:outline-none text-sm"
                        />
                    </div>
                    <div className='text-right'>
                        <button className="cancel-button mr-3" onClick={() => {
                            setIsHeaderEdit(false)
                        }} >
                            Cancel
                        </button>
                        <button
                            className="save-button my-3"
                            onClick={() => {
                                handleLinkSave(index)
                                setIsHeaderEdit(false)

                            }}
                        >
                            Save changes
                        </button>
                    </div>
                </div>
            </div>}
        </>
    )
}

export default AddLinks