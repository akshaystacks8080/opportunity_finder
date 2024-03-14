import "./App.css";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

function App() {
    const options = ["one", "two", "three"];
    const defaultOption = options[0];
    return (
        <div className="App">
            <header className="App-header">
                <h1>Opportunity Finder</h1>

                <p>
                    Tool for helping professors collaborate and find similar
                    research partners
                </p>
            </header>
            <div>
                <Dropdown
                    options={options}
                    onChange={this._onSelect}
                    value={defaultOption}
                    placeholder="Select an option"
                />
            </div>
        </div>
    );
}

export default App;
