import React, { useEffect, useState, useContext} from 'react';
import {useSortable} from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';
import './style.css'
import teams from '../../../data/NFL_teams.json'
import styled, { css } from 'styled-components';
import { isMobile } from 'react-device-detect';
import {DraftContext} from '../../../Context/DraftContext';

const SortableItem = (props) => {
  const { myTeams, setMyTeams } = useContext(DraftContext)
  const logo = `/${teams.filter(team => team.team_abbr == props.team.abbreviation)[0]?.team_abbr}.png`;
  const [pressadle, setPressadle] = useState(0);
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
    boxShadow: (myTeams.indexOf(props.id)!=-1) ? '0 0 0 1px #9d4f0c' : 'none',
    border: (myTeams.indexOf(props.id)!=-1) ?'1px solid #f65e1b' : '1px solid #dce0e5',
    width: isMobile ? 'auto' : '200px',
    height: isMobile ? 'auto' : '50px',
  };
  
  const selectThisTeam = () => {
    let array = myTeams;
    if(array.indexOf(props.id)==-1) {
      setMyTeams(prevTeams => ([...prevTeams,props.id]));
    } else {
      array = array.filter(item => item != props.id);
      props.setCheckbox(false);
      setMyTeams(array);
    }
    setPressadle(pressadle + 1);
    //props.setSelectedTeams(array);
  }

  return (
    <Sortable ref={setNodeRef} className='team-item' style={style} onClick={selectThisTeam} isMobile={isMobile}>
      <FlexDiv>
        <NumberPick>
          {props.index + 1}
        </NumberPick>
        <NameTeam>
          {isMobile ? /*props.team.abbreviation*/ null : props.team.nickname}
          {isMobile ? <Logo src={logo} style={{width:'1rem',height:'1rem'}} /> : null}
        </NameTeam>
      </FlexDiv>
      
    <DragHandler>
      {!isMobile && <Logo src={logo} />}
      <button className='btt-drag-handler' style={{cursor: isDragging ? 'grabbing' : "grab"}} {...listeners} {...attributes}>
      <svg viewBox="0 0 20 20" className='svg-drag-handler' width="20">
        <path d="M7 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 2zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 7 14zm6-8a2 2 0 1 0-.001-4.001A2 2 0 0 0 13 6zm0 2a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 8zm0 6a2 2 0 1 0 .001 4.001A2 2 0 0 0 13 14z"></path>
      </svg>
      </button>
      </DragHandler>
    </Sortable>
  );
}

export default SortableItem;

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