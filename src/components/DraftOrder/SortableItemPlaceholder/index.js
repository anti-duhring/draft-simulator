import React, { useEffect, useState, useContext} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import './style.css'
import styled, { css } from 'styled-components';
import { isMobile } from 'react-device-detect';
import ContentLoader from 'react-content-loader'

const SortableItemPlaceholder = (props) => {

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({id: props.id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? "100" : "auto",
    boxShadow:  'none',
    border:  '1px solid #dce0e5',
    width: isMobile ? 'auto' : '200px',
    height: isMobile ? 'auto' : '50px',
  };

  const LogoMobile = () => {
    return (
        <ContentLoader 
            speed={0.8}
            width={25}
            height={16}
            backgroundColor="#dce0e5"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="2" ry="2" width="25" height="13" />
        </ContentLoader>
    )
  }
  const TeamName = () => {
    return (
        <ContentLoader 
            speed={0.8}
            width={55}
            height={16}
            backgroundColor="#dce0e5"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="2" ry="2" width="55" height="13" />
        </ContentLoader>
    )
  }
  const Logo = () => {
    return (
        <ContentLoader 
            speed={0.8}
            width={30}
            height={30}
            backgroundColor="#dce0e5"
            foregroundColor="#ecebeb"
        >
            <rect x="0" y="0" rx="2" ry="2" width="30" height="30" />
        </ContentLoader> 
    )
  }

  return (
    <Sortable ref={setNodeRef} className='team-item' style={style} isMobile={isMobile}>
      <FlexDiv>
        <NumberPick>
          {props.index + 1}
        </NumberPick>
        <NameTeam>
            {isMobile ? <LogoMobile /> :
            <TeamName />
            }
        </NameTeam>
      </FlexDiv>
      
    <DragHandler>
        {!isMobile && <Logo />}
      <button className='btt-drag-handler' style={{cursor: isDragging ? 'grabbing' : "grab"}} {...listeners} {...attributes}>
      <svg viewBox="0 0 20 20" className='svg-drag-handler' width="20">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
      </button>
      </DragHandler>
    </Sortable>
  );
}

export default SortableItemPlaceholder;

const DragHandler = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
`

const FlexDiv = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 5px;
  justify-content: flex-end;
`

const Logo = styled.img`
  width: 2rem;
  height: 2rem;
`

const NameTeam = styled.div`
  font-size: .75rem;
  color:#7b8187;
  display: flex;
`

const NumberPick = styled.div`
  font-size: ${isMobile ? '1rem' : '1.25rem'};
  color:#393c40;
  font-weight: bold;
`

const Sortable = styled.div((props) => css`
  &:hover .btt-drag-handler svg {
    fill: ${props.isMobile ? '#919eab' : '#f65e1b'};
  }
  &:hover {
    ${!props.isMobile &&
      css`
        
          border: 1px solid #f65e1b!important;
        
      `
    }
  }
`)