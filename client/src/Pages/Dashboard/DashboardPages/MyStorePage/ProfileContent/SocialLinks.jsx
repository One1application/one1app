import React, { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { Button, Switch } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGripVertical } from '@fortawesome/free-solid-svg-icons';
import { alpha, styled } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { socialLogos } from '../StoreConfig';

export const MySwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: green[600],
      '&:hover': {
        backgroundColor: alpha(green[600], theme.palette.action.hoverOpacity),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: green[600],
    },
  }));

const SocialLinks = ({socialLinks, setSocialsLinks}) => {

    const label = { inputProps: { 'aria-label': 'controlled' } };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedLinks = Array.from(socialLinks);
        const [removed] = reorderedLinks.splice(result.source.index, 1);
        reorderedLinks.splice(result.destination.index, 0, removed);

        setSocialsLinks([...reorderedLinks]);
    };

    const handleSocialToggle = (id) => {
        console.log({id})
        setSocialsLinks((prevLinks) =>prevLinks.map((link) =>
                link.id === id ? { ...link, enabled: !link.enabled } : link
        ))
    };

    const handleInputSave = (value, id) => {
        setSocialsLinks((prevLinks) => prevLinks.map((link) =>
                link.id === id ? { ...link, value } : link
            ),
        );
    };

    return (
        <div className="social-section">
            <label>Social Link</label>
            <select className="form-select">
                <option>Position on profile - Top</option>
            </select>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="social-links-list">
                    {(provided) => (
                        <div
                            className="social-links-list"
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {socialLinks?.map((link, index) => {
                                const [isEdit, setIsEdit] = useState(false);
                                const [inputValue, setInputValue] = useState(link?.value)
                                return <Draggable key={link.id} draggableId={link.id} index={index}>
                                    {(provided) => (
                                        <div
                                            className="social-link-item"
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                        >
                                            <div className="social-info">
                                                <div className="drag-space"  {...provided.dragHandleProps}>
                                                    <FontAwesomeIcon icon={faGripVertical} />
                                                </div>
                                                <img className='social-logos' src={socialLogos[link.id]} alt="instagram" />
                                                {
                                                    isEdit ? <input type="text" value={inputValue} onChange={({ target }) => setInputValue(target.value)} className='edit-input' /> : <span>{link.name}</span>
                                                }

                                            </div>
                                            <div className='edit-right-section'>
                                                {isEdit ? <Button sx={{
                                                    padding: "0",
                                                    backgroundColor: "black",
                                                    color: "white",
                                                    textTransform: "none",
                                                    borderRadius: "16px",
                                                }} onClick={() => {
                                                    handleInputSave(inputValue, link.id)
                                                    setIsEdit(false)
                                                }}>Save</Button> : <EditOutlinedIcon className="editIcon" onClick={() => setIsEdit(true)} />}
                                                <div className="toggle-switch">
                                                <MySwitch {...label} checked={link.enabled}
                                                        onChange={() => handleSocialToggle(link.id)}  />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            }
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default SocialLinks;