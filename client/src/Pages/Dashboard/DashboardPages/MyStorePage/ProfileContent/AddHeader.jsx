import React, { useEffect, useState } from 'react'
import { useStore } from '../../../../../context/StoreContext/StoreState';
import { Button, Menu, MenuItem } from "@mui/material";
import { MySwitch } from "./SocialLinks";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';


const AddHeader = ({ item, index }) => {
    const { header, setHeader } = useStore();
    const [showMenu, setShowMenu] = useState(null);
    const [headerValue, setHeaderValue] = useState("");
    const [isHeaderEdit, setIsHeaderEdit] = useState(false);

    const open = Boolean(showMenu)


    const handleInputSave = (i, value) => {
        const newHeaders = header.map((data, index) => i === index ? { ...data, value } : data)
        setHeader(newHeaders);
    }

    const handleHeaderToggle = (i) => {
        const newHeaders = header.map((data, index) => i === index ? { ...data, enable: !data.enable } : data)
        setHeader(newHeaders);
    }

    const handleDeleteHeader = (i) => {
        const newHeaders = header.filter((data, index) => i !== index);
        setHeader(newHeaders);
    }

    useEffect(() => {
        setHeaderValue(item?.value);
    }, [item])

    return (<div
        key={index}
        className="social-link-item mb-3"
    >
        <div className="social-info">
            {
                isHeaderEdit ? <input type="text" value={headerValue} onChange={({ target }) => setHeaderValue(target.value)} className='edit-input' /> : <span>{headerValue}</span>
            }
        </div>
        <div className='edit-right-section'>
            {isHeaderEdit ? <Button sx={{
                padding: "0",
                backgroundColor: "black",
                color: "white",
                textTransform: "none",
                borderRadius: "16px",
            }} onClick={() => {
                handleInputSave(index, headerValue)
                setIsHeaderEdit(false)
            }}>Save</Button>
                : <EditOutlinedIcon className="editIcon" onClick={() => setIsHeaderEdit(true)} />}
            <div className="toggle-switch">
                <MySwitch checked={item?.enable}
                    onChange={() => handleHeaderToggle(index)} />
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
                        handleDeleteHeader(index)
                        setShowMenu(null)
                    }}>Delete</MenuItem>
                </Menu>
            </div>
        </div>
    </div>
    )
}

export default AddHeader