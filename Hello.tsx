import * as React from "react";
import _ from "lodash";
import * as Mousetrap from "mousetrap";
import { Modal,IconButton } from "office-ui-fabric-react";
import { Tree, ReactD3TreeItem, ReactD3TreeTranslate } from "react-d3-tree";
import ArrowDropDown from "@material-ui/icons/ArrowBackIos";
import { hierarchy, levelsData, ILevel, IDevice, IGroup } from "./Data";
import "./Hierarchy.css";

interface ISelectedNode {
  id: number;
  name: string;
  type: "group" | "device";
  level: string;
}

export interface ISelectedHierarchy {
  group: IGroup;
  devices: IDevice[];
}

class NodeLabel extends React.Component<any, {}> {
  constructor(props: any, state: {}) {
    super(props, state);
    this.handleClick = this.handleClick.bind(this);
  }

  render() {
    const { nodeData, selectedData } = this.props;

    const id: number = Number.parseInt(nodeData.attributes.id);
    const type: string = nodeData.attributes.type;
    const isDummy = nodeData.name === "";
    const isEnabled = nodeData.attributes.enabled === "true" ? true : false;
    const isSelected = !_.isNil(
      selectedData.find(
        (x: { id: number; type: any }) => x.id === id && x.type === type
      )
    );

    return (
      <div
        className={isEnabled
          ? isSelected
            ? "node-selected"
            : "node-default"
          : "node-disabled"}
        onClick={isEnabled ? this.handleClick : null}
        style={{
          visibility: isDummy ? "hidden" : "visible",
        }}
      >
        {isDummy ? (
          nodeData._collapsed ? (
            <span>Hidden</span>
          ) : (
              ""
            )
        ) : (
            <span>{nodeData.name}</span>
          )}
      </div>
    );
  }

  handleClick(): void {
    this.props.onSelect(this.props.nodeData);
  }
}

export interface IHierarchySettings {
  enabledOrders: number[];
  groupDrilldown: boolean;
  multiselect: boolean;
  enableDevices: boolean;
}

interface IProps extends IHierarchySettings {
  onSelected(nodes: ISelectedHierarchy[]): void;
}

interface IState {
  isOpen: boolean;
  treeData: ReactD3TreeItem[];
  translate: ReactD3TreeTranslate;
  selectedNodes: ISelectedNode[];
}

class HierarchyTree extends React.Component<IProps, IState> {
  private treeContainer: any;
  private devices: IDevice[];
  private groups: IGroup[];
  private levels: ILevel[];

  constructor(props: any, state: IState) {
    super(props, state);

    this.state = {
      isOpen: true,
      treeData: null,
      translate: {
        x: 1,
        y: 1,
      },
      selectedNodes: [],
    };

    this.handleClicked = this.handleClicked.bind(this);
    this.confirmSelected = this.confirmSelected.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  render() {
    const { treeData, selectedNodes, isOpen } = this.state;

    return (
      <div>
        <div
          data-is-focusable="true"
          role="listbox"
          aria-haspopup="listbox"
          className={
            "ms-Dropdown dropdown-81 button-div" +
            (treeData ? " " : " disabled")
          }
          onClick={treeData ? this.openModal : null}
        >
          <span
            id="Dropdown-hierarchy-option"
            className="ms-Dropdown-title title-103"
            aria-live="polite"
            aria-atomic="true"
            aria-invalid="false"
          >
            {!treeData
              ? "Loading..."
              : selectedNodes.length > 0
                ? selectedNodes.map(
                  (name, index) =>
                    ` ${name.name}  ${
                    index === selectedNodes.length - 1
                      ? " "
                      : ","
                    }`
                )
                : "Select devices	"}
          </span>
          {!treeData ? null : (
            <span className="ms-Dropdown-caretDownWrapper caretDownWrapper">
              <ArrowDropDown className="dropdownIcon" />
            </span>
          )}
        </div>
        <Modal
          isOpen={isOpen}
          isBlocking={false}
          layerProps={{
            eventBubblingEnabled: true,
          }}>
        
          <IconButton
          style={{
            position: "absolute",
            top:"10px",
            right:"10px"
          }}
              iconProps={{ iconName: 'Cancel' }}
              ariaLabel="Close popup modal"
              onClick={this.closeModal}
            />

          <div
            ref={(ref) => (this.treeContainer = ref)}
            style={{
              height: "95vh",
              width: "95vw",
            }}
          >
                      {treeData ? (
              <Tree
                allowForeignObjects
                data={treeData}
                nodeSvgShape={{
                  shape: "none",
                }}
                separation={{
                  siblings: 1,
                  nonSiblings: 1.5,
                }}
                translate={this.state.translate}
                nodeSize={{
                  x: 180,
                  y: 57,
                }}
                collapsible={false}
                pathFunc="diagonal"
                nodeLabelComponent={{
                  render: (
                    <NodeLabel
                      onSelect={this.handleClicked}
                      selectedData={selectedNodes}
                    />
                  ),
                  foreignObjectWrapper: {
                    y: -16.5,
                  },
                }}
              />
            ) : null}
          </div>
          <div className="help-hot-key">
          <div className="hot-key-escape">
          Esc
          <hr/>
          </div>
          <div className="hot-key-enter">
          Enter
           <hr/>
          </div>
          </div>
        
        </Modal>
      </div>
    );
  }

  componentDidMount() {
    this.fetch();
    Mousetrap.bind("enter", this.confirmSelected);
    Mousetrap.bind("esc", this.clearSelected);
  }

  componentDidUpdate() {
    if (this.treeContainer) {
      if (this.state.translate.x === 1 && this.state.translate.y === 1) {
        const dimensions = this.treeContainer.getBoundingClientRect();

        this.setState({
          translate: {
            x: dimensions.width * 0.05,
            y: dimensions.height / 2,
          },
          isOpen: false,
        });
      }
    }
  }

  componentWillUnmount() {
    Mousetrap.unbind("enter");
    Mousetrap.unbind("esc");
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  async fetch() {
    var groups: IGroup[] = this.groups = hierarchy;
    var levels: ILevel[] = this.levels = levelsData;
    var devices: IDevice[] = [];

    console.log({ groups, levels });

    //#region Remove groups that contains a parent
    groups = groups.filter((group) => !_.isNil(group.level));
    groups = groups.sort((a, b) => b.level.order - a.level.order);

    var ignoreGroups: number[] = [];
    groups.forEach((group: IGroup) => {
      devices = devices.concat(group.devices);
      var parent = groups.find(
        (x: IGroup) => x.groups.findIndex((x) => x.id === group.id) >= 0
      );

      if (parent) {
        ignoreGroups.push(group.id);
      }
    });

    this.devices = devices;

    groups = groups.filter((group: IGroup) =>
      _.isNil(ignoreGroups.find((x) => x === group.id))
    );
    //#endregion

    var treeData: ReactD3TreeItem[] = [];
    var maximumOrder = this.props.enableDevices
      ? null
      : _.max(this.props.enabledOrders);

    groups.forEach((group: IGroup) =>
      treeData.push(this.buildTree(group, levels, maximumOrder))
    );

    if (treeData.length > 1) {
      treeData = [
        {
          name: "ThingSight",
          attributes: {
            id: null,
            type: "group",
            level: null,
            selected: "false",
          },
          children: treeData,
        },
      ];
    }

    this.setState({
      treeData,
    });
  }

  buildTree(
    group: IGroup,
    levels: ILevel[],
    maximumOrder: number
  ): ReactD3TreeItem {
    if (maximumOrder) {
      if (group.level.order > maximumOrder) {
        return null;
      }
    }

    const { enableDevices, enabledOrders } = this.props;

    //Define the parent
    let parent: ReactD3TreeItem = {
      name: group.name,
      attributes: {
        id: group.id.toString(),
        type: "group",
        level: group.level.name,
        enabled: _.isNil(
          this.props.enabledOrders.find(
            (order: number) => group.level.order === order
          )
        )
          ? "false"
          : "true",
        selected: "false",
      },
      children: [],
    };

    if (enableDevices) {
      let devicesParent = parent;
      let missingLevels: ILevel[] = levels.filter(
        (level: ILevel) => level.order > group.level.order
      );

      if (group.devices.length > 0) {
        missingLevels.forEach((level: ILevel) => {
          var placeholderParent: ReactD3TreeItem = {
            name: "",
            attributes: {
              id: null,
              type: "group",
              level: level.name,
            },
            children: [],
          };

          devicesParent.children.push(placeholderParent);
          devicesParent = placeholderParent;
        });

        group.devices.forEach((device: IDevice) => {
          devicesParent.children.push({
            name: device.name,
            attributes: {
              id: device.id.toString(),
              type: "device",
              level: "device",
              enabled: "true",
              selected: "false",
            },
            children: null,
          });
        });
      }
    }

    group.groups.forEach((childGroup: IGroup) => {
      let child: ReactD3TreeItem = this.buildTree(
        childGroup,
        levels,
        maximumOrder
      );

      if (child === null) {
        return;
      }

      let groupParent = parent;
      let missingLevels: ILevel[] = levels.filter(
        (level: ILevel) =>
          level.order > group.level.order &&
          level.order < childGroup.level.order
      );

      missingLevels.forEach((level: ILevel) => {
        let placeholderGroup: ReactD3TreeItem = groupParent.children.find(
          (x) => x.name === "" && x.attributes.level === level.name
        );

        //Placeholder doesn't exist
        if (_.isNil(placeholderGroup)) {
          placeholderGroup = {
            name: "",
            attributes: {
              id: null,
              type: "group",
              level: level.name,
            },
            children: [],
          };

          groupParent.children.push(placeholderGroup);
        }

        groupParent = placeholderGroup;
      });

      groupParent.children.push({
        ...child,
        attributes: {
          id: childGroup.id.toString(),
          type: "group",
          level: childGroup.level.name,
          enabled: _.isNil(
            enabledOrders.find((x) => childGroup.level.order === x)
          )
            ? "false"
            : "true",
          selected: "false",
        },
      });
    });

    return parent;
  }

  handleClicked(node: ReactD3TreeItem) {
    const id: number = Number.parseInt(node.attributes.id);
    const type: any = node.attributes.type;
    const level: string = node.attributes.level;

    if (!_.isNil(id)) {
      let { selectedNodes } = this.state;
      const { multiselect } = this.props;

      let selectedNode: ISelectedNode = selectedNodes.find(
        (node) => node.id === id && node.type === type
      );

      if (selectedNode) {
        selectedNodes = selectedNodes.filter(
          (node: ISelectedNode) =>
            !(node.id === id && node.type === type)
        );
      } else {
        let selectedNode: ISelectedNode = {
          id,
          type,
          level,
          name: node.name,
        };

        if (multiselect) {
          selectedNodes.push(selectedNode);
        } else {
          selectedNodes = [selectedNode];
        }
      }

      selectedNodes = selectedNodes.filter((x) => x.level === level);
      this.setState({
        selectedNodes,
      });
    }
  }

  confirmSelected() {
    const { onSelected, groupDrilldown } = this.props;
    const { selectedNodes } = this.state;
    const levels = this.levels;

    if (_.isEmpty(selectedNodes)) {
      onSelected([]);
    } else {
      let selectedLevel = levels.find(
        (level) => level.name === selectedNodes[0].level
      );
      let result: ISelectedHierarchy[] = [];

      if (_.isNil(selectedLevel)) {
        let devices = selectedNodes.map((node) =>
          this.devices.find((device) => device.id === node.id)
        );

        result = [
          {
            group: null,
            devices,
          },
        ];
      } else {
        let groups: IGroup[] = selectedNodes
          .map((x) =>
            this.groups.find((group: IGroup) => group.id === x.id)
          )
          .filter((group) => !_.isNil(group));

        if (groupDrilldown) {
          let devices: IDevice[] = [];

          groups.forEach((group) => {
            devices = devices.concat(this.getAllDevices(group));
          });

          result.push({
            group: null,
            devices,
          });
        } else {
          let childrenGroups: IGroup[] = [];

          if (selectedNodes.length === 1) {
            let group = groups[0];
            childrenGroups = childrenGroups.concat(group.groups);

            result.push({
              group: group,
              devices: group.devices,
            });
          } else {
            childrenGroups = groups;
          }

          childrenGroups.forEach((group) => {
            result.push({
              group,
              devices: this.getAllDevices(group),
            });
          });

          result = result.filter((x) => !_.isEmpty(x.devices));
        }
      }

      onSelected(result);
    }

    this.closeModal();
  }

  clearSelected() {
    this.setState({
      selectedNodes: [],
    });
  }

  getAllDevices(group: IGroup): IDevice[] {
    var devices: IDevice[] = group.devices;
    group.groups.forEach(
      (childGroup) =>
        (devices = devices.concat(this.getAllDevices(childGroup)))
    );
    return devices;
  }
}

export default HierarchyTree;
