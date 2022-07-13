import { useState } from 'react';
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
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

const DraftOrderContainer = () => {
  const [teams,setTeams] = useState(data.teams);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: rectSortingStrategy,
  }));

  const handleDragEnd = (event) => {
    const {active, over} = event;
    
    if (active.id !== over.id) {
      setTeams((items) => {
        const oldIndex = items.map(e => e.franchise_id).indexOf(active.id);
        const newIndex = items.map(e => e.franchise_id).indexOf(over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div>
  <DndContext
    sensors={sensors}
    collisionDetection={closestCenter}
    onDragEnd={handleDragEnd}
  >

<SortableContext 
        items={teams}
        strategy={rectSortingStrategy}
      >
        <Grid>
        {
          teams.map((team,index) => {
            return (
              <SortableItem key={team.franchise_id} id={team.franchise_id} team={team} index={index} selectedTeams={selectedTeams} setSelectedTeams={setSelectedTeams} />
            )
          })
        }
        </Grid>
      </SortableContext>
  </DndContext>
  </div>
)}

export default DraftOrderContainer;

const Grid = styled.div`
  display: grid;
  grid-template: repeat(8, 1fr) / repeat(2, 1fr);
  grid-gap: 10px;
  padding: 10px;
  grid-auto-flow: column dense;
`


