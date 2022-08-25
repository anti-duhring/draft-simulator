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
//import SortableItem from '../SortableItem';
import SortableItem from '../../components/DraftOrder/SortableItem';
import styled from 'styled-components';
import { isMobile } from 'react-device-detect';
import FormHeader from '../../components/DraftOrder/FormHeader';
import FormFooter from '../../components/DraftOrder/FormFooter';
import { DraftContext } from '../../Context/DraftContext'
import SortableItemPlaceholder from '../../components/DraftOrder/SortableItemPlaceholder';
import { DARK_BLACK } from '../../constants/Colors';

const DraftOrder = (props) => {
  const {
    setMyTeams,
    draftOrder,
    setDraftOrder,
    setCurrentPick,
    setCurrentRound,
    setPicksPlayers,
    setTradeHistory
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

  useEffect(() => {
    setCurrentPick(1)
    setCurrentRound(1) 
    setPicksPlayers([]) 
    setTradeHistory([])
  },[])

  return (
  <Container>
    <Title>Simulador de Draft</Title>
    <Body>
      <FormHeader checkbox={checkbox} checkAll={checkAll} />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >

          <SortableContext 
              items={draftOrder ?? new Array(32).fill(0)}
              strategy={rectSortingStrategy}
          >
            <Grid>
            { draftOrder?
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
              }) :
              new Array(32).fill(0).map((i, index) => {
                return (
                  <SortableItemPlaceholder
                    key={index}
                    index={index}
                  />
                )
              })
            }
            </Grid>
          </SortableContext>
        </DndContext>
      <FormFooter />
    </Body>
  </Container>
)}

export default DraftOrder;

const Grid = styled.div`
  display: grid;
  grid-template: repeat(8, 1fr) / repeat(4, 1fr);
  grid-gap: 10px;
  padding: 10px;
  grid-auto-flow: column dense;
`
const Container = styled.div`
  margin-bottom: 10px;
`
const Body = styled.div`
  box-shadow: 0 1px 3px rgb(22 24 26 / 20%), 0 5px 10px -3px rgb(22 24 26 / 10%);
  border: 1px solid #dce0e5;
  padding-top: 10px;
  padding-bottom: 10px;
  border-radius: 0 0 5px 5px;
`
const Title = styled.div`
  background-color: ${DARK_BLACK};
  color: white;
  border-radius: 5px 5px 0 0;
  padding: .3rem 0 .3rem 0;
`