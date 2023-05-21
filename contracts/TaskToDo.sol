// SPDX-Licence-Identifier: GLP-3.0
// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

contract TaskToDo {
    enum TaskStatus {
        Pending,
        Finished
    }
    address owner;

    struct Task {
        string desc;
        TaskStatus status;
    }

    Task[] public tasks;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not Owner");
        _;
    }

    function addTask(string memory _desc) public onlyOwner {
        tasks.push(Task(_desc, TaskStatus.Pending));
    }

    function markAsFinished(uint256 id) public onlyOwner {
        require(id < tasks.length, "No task has been found");
        tasks[id].status = TaskStatus.Finished;
    }

    function getTaskCount() public view returns (uint256) {
        return tasks.length;
    }

    function getAllTasks() public view returns (Task[] memory) {
        return tasks;
    }

    function getTask(
        uint256 id
    ) public view returns (string memory, TaskStatus) {
        require(id < tasks.length, "No task has been found");
        return (tasks[id].desc, tasks[id].status);
    }
}
