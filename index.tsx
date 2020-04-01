import React, { Component } from 'react';
import { render } from 'react-dom';
import HierarchyTree from './Hello';
import './style.css';

interface AppProps { }
interface AppState {
  name: string;
}

class App extends Component<AppProps, AppState> {
  constructor(props) {
    super(props);
    this.state = {
      name: 'React'
    };
    this.onSelect = this.onSelect.bind(this);
  }

  render() {
    return (
      <div>
        <HierarchyTree
          enabledOrders={[0, 1, 2]}
          groupDrilldown={true}
          multiselect={true}
          enableDevices={true}
          onSelected={this.onSelect}
        />
      </div>
    );
  }

  onSelect(data: any) {
    console.log(data);
  }
}

render(<App />, document.getElementById('root'));
