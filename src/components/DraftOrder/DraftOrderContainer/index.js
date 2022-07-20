import { useState, useEffect, useContext } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import SortableItem from '../SortableItem';
import data from '../../../data/draft_picks.json'
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import FormHeader from '../FormHeader';
import FormFooter from '../FormFooter';
import { DraftContext } from '../../../Context/DraftContext';

const DraftOrderContainer = (props) => {
  const {
    myTeams,
    setMyTeams,
    draftOrder,
    setDraftOrder
  } = useContext(DraftContext);
  const [checkbox, setCheckbox] = useState(false);
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: rectSortingStrategy,
  }));

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if(!active || !over) return
    
    if (active.id !== over.id) {
      setDraftOrder((items) => {
        const oldIndex = items.map(e => e.franchise_id).indexOf(active.id);
        const newIndex = items.map(e => e.franchise_id).indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const checkAll = () => {
    setCheckbox(checkbox ? false : true);
    setMyTeams(checkbox ? [] : draftOrder.map(e => e.franchise_id))
  }

  /*const handleDraftOrder = () => {
    console.log(teams, selectedTeams);
    props.setStep('picks');
    props.setDraftOrder(teams);
    props.setMyTeams(selectedTeams);

    return teams + selectedTeams
  }*/

  return (
  <Container>
    <FormHeader checkbox={checkbox} checkAll={checkAll} />
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
  >

    <SortableContext 
        items={draftOrder}
        strategy={rectSortingStrategy}
    >
      <Grid>
      {
        draftOrder.map((team,index) => {
          return (
            <SortableItem 
              key={team.franchise_id} 
              id={team.franchise_id} 
              team={team} 
              index={index} 
              setCheckbox={setCheckbox} 
            />
          )
        })
      }
      </Grid>
    </SortableContext>
  </DndContext>
      <FormFooter />
  </Container>
)}

export default DraftOrderContainer;

const Grid = styled.div`
  display: grid;
  grid-template: repeat(8, 1fr) / repeat(4, 1fr);
  grid-gap: 10px;
  padding: 10px;
  grid-auto-flow: column dense;
`
const Container = styled.div`
  box-shadow: 0 1px 3px rgb(22 24 26 / 20%), 0 5px 10px -3px rgb(22 24 26 / 10%);
  border: 1px solid #dce0e5;
  padding-top: 10px;
  padding-bottom: 10px;
  margin-bottom: 10px;
  border-radius: 5px;
`
