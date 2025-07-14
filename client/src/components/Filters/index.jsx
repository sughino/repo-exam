import Text from "../Text";
import { Select } from "../Select";
import './filters.css';
import { Icon } from "../Icon";
import { useContext, useEffect, useState } from "react";
import { ThemeContext } from "styled-components";
import { Skeleton } from '@mui/material';

/*const filters = {
  Users: ['User id', 'Name & Surname', 'Email', 'Admin'],
  PersonalData: ['personalDataID', 'email', 'city'],
  Deliveries: ['deliveryID', 'withdrawalDate', 'deliveryDate', 'State'],
}

const searchForPlaceholder = {
  Users: 'Search by name and surname',
  PersonalData: 'Search by address',
  Deliveries: 'Search for key delivery',
}*/
export const Filters = ({
  filtersSelect,
  searchForPlaceholder,
  onSelect,
  onSearchedText,
  onSortBy,
  onFiltersBy
}) => {
  const theme = useContext(ThemeContext);
  const [sortingDesc, setSortingDesc] = useState(false);
  const [typeOfSelected, setTypeOfSelected] = useState(1);
  const [searchedText, setSearchedText] = useState('');
  const [selectedItem, setSelectedItem] = useState('');

  useEffect(() => {
    onSelect(false);
    onSortBy(sortingDesc);
    onFiltersBy(selectedItem);
  }, []);

  useEffect(() => {
    onFiltersBy(selectedItem);
  }, [selectedItem, onFiltersBy])

  return (
    <div className="filters-main-container">

      <div className="filters-orderby-main">
        <div className="filters-text">
          <Text variant={'subtitle'}>Order by</Text>
        </div>
        <div className="filters-orderby-inputs">
            <Select selectElements={filtersSelect} onSelectedItems={setSelectedItem}/>
            <div className="sort-icon-container" onClick={() => {
                setSortingDesc(!sortingDesc);
                onSortBy(!sortingDesc);
              }}
            >
              <div className="icon-feedback-wrapper">
                <Icon name={sortingDesc ? 'arrow-up-a-z' : 'arrow-down-a-z'} size={22}/>
              </div>
            </div>
        </div>
      </div>

      <div className="filters-typeof-container">

        <div
          className="typeof-icon-container"
          style={{background: typeOfSelected === 0 ? theme.colors.white30 : theme.colors.white20}}
          onClick={() => {
            setTypeOfSelected(0);
            onSelect(true);
          }}
        >
          <div className="icon-feedback-wrapper">
            <Icon name={'menu'} size={22}/>
          </div>
        </div>

        <div
          className="typeof-icon-container"
          style={{background: typeOfSelected === 1 ? theme.colors.white30 : theme.colors.white20}}
          onClick={() => {
            setTypeOfSelected(1);
            onSelect(false);
          }}
        >
          <div className="icon-feedback-wrapper">
            <Icon name={'grid-2x2'} size={22}/>
          </div>
        </div>

      </div>


      <div className="filters-search-container">
          <input className="filters-search-input" type="text" 
            value={searchedText} onChange={(e) => {
              setSearchedText(e.currentTarget.value)
              onSearchedText(e.currentTarget.value);
            }}
            placeholder={searchForPlaceholder}
          />
          <div className="icon-search-wrapper">
            <Icon name={'search'} size={22}/>
          </div>
      </div>
    </div>
  )
}

export const LoadingFilters = () => {
  const theme = useContext(ThemeContext);
  //TODO Aggiungi le query css per renderlo mobile friendly
  return (
    <div className="filters-main-container">

      <div className="filters-orderby-main">
        <Skeleton variant="text" sx={{ bgcolor: theme.colors.white05, width: 60, fontSize: 20 }}/>
        <div className="filters-orderby-inputs">
          <Skeleton variant="rectangular" width={155} height={35} sx={{ bgcolor: theme.colors.white05, borderRadius: '10px' }}/>
        </div>
      </div>


      <div className="filters-typeof-container">
        <Skeleton variant="rectangular" width={70} height={35} sx={{ bgcolor: theme.colors.white05, borderRadius: '10px' }}/>
      </div>


      <div className="filters-search-container">
        <Skeleton variant="rectangular" width={250} height={35} sx={{ bgcolor: theme.colors.white05, borderRadius: '10px' }}/>
      </div>

      <div className="modal-filter-wrapper">   
        <div className="modal-filters-button.loading">
          <Skeleton variant="rectangular" width={70} height={35} sx={{ bgcolor: theme.colors.white05, borderRadius: '10px' }}/>
        </div>
      </div>

    </div>
  )
}