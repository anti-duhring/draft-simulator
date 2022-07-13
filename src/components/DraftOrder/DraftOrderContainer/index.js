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
import { isMobile } from 'react-device-detect';

const DraftOrderContainer = () => {
  const [teams,setTeams] = useState(data.teams);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [checkbox, setCheckbox] = useState(false);
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

  const checkAll = () => {
    setCheckbox(checkbox ? false : true);
    setSelectedTeams(checkbox ? [] : teams.map(e => e.franchise_id))
  }

  return (
  <Container>
    <FormHeader>
      <Legend>
          <LegendTitle>Selecione seus times</LegendTitle>
          <LegendSubtitle>Cada time não selecionado terá o draft automatizado</LegendSubtitle>
      </Legend>
      <Checkbox>
        <CheckboxContainer>
        <Label>Todos
          <InputCheckbox type="checkbox" checked={checkbox} onChange={checkAll} />
          <Checkmark className='checkmark'></Checkmark>
        </Label>
        </CheckboxContainer>
      </Checkbox>
    </FormHeader>
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
            <SortableItem key={team.franchise_id} id={team.franchise_id} team={team} index={index} selectedTeams={selectedTeams} setSelectedTeams={setSelectedTeams} setCheckbox={setCheckbox} />
          )
        })
      }
      </Grid>
    </SortableContext>
  </DndContext>
  <FormFooter>
    <Button>Começar Draft</Button>
  </FormFooter>
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

const Legend = styled.div`
  flex:1;
  display: flex;
  flex-direction: column;
  text-align: left;
  padding-left: 10px;
`
const LegendTitle = styled.span`
  font-weight: bold;
`

const LegendSubtitle = styled.span`
  font-size: .75rem;
  color: #7b8187;
`

const FormHeader = styled.div`
  display: flex;
  align-content: center;
  align-items: center;
`

const Checkbox = styled.div`
  flex: 1;
  text-align: right;
`

const CheckboxContainer = styled.div`
  margin-right: 10px;
`

const InputCheckbox = styled.input`
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
  &:checked ~ .checkmark {
    background-color: #f65e1b !important;
  }
  &:checked ~ .checkmark::after {
    display: block;
  }
`

const Label = styled.label`
  position: relative;
  padding-right: 35px;
  cursor: pointer;
  &:hover .checkmark{
    background-color: #ccc;
  }
  user-select: none;
  -webkit-touch-callout: none;
`

const Checkmark = styled.span`
  position: absolute;
  top: 0;
  right: 0;
  height: 25px;
  width: 25px;
  background-color: #eee;
  &::after {
    content: "";
    position: absolute;
    display: none;
    left: 8px;
    top: 2px;
    width: 9px;
    height: 15px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
`

const FormFooter = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-right: 10px;
`

const Button = styled.button`
    display: inline-block;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-transform: uppercase;
    height: 40px;
    line-height: 40px;
    background: #0a0a0a;
    color: #fff;
    padding: 0 25px;
    max-width: 100%;
    font-size: 10px;
    font-weight: 600;
    border: 0;
    outline: 0;
    position: relative;
    cursor: pointer;
    border-radius: 300px;
    white-space: nowrap;
    -moz-appearance: none;
    -webkit-appearance: none;
    transition: .3s;
    &:hover {
      background-color: #f65e1b;
    }
`