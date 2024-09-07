import { addWorkflow, getWorkflowById, getAllWorkflows } from '../models/Workflow.js';
import axios from 'axios';
import { Readable } from 'stream';
import csv from 'csv-parser';
import WorkflowExecution from '../models/workflowexecution.js';



 export const saveWorkflow = async (req, res) => {
  try {
    const { workflowId, nodes } = req.body;

    // Validate workflowId
    if (typeof workflowId !== 'string' || workflowId.trim() === '') {
      return res.status(400).json({ message: 'Invalid workflowId.' });
    }

    // Validate nodes
    if (!Array.isArray(nodes) || !nodes.every(item => typeof item === 'string')) {
      return res.status(400).json({ message: 'Invalid nodes format. Expected an array of strings.' });
    }

    // Save workflow
    const result = await addWorkflow({ workflowId, nodes });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};



// Get all workflows
export const getWorkflows = async (req, res) => {
  try {
    const workflows = await getAllWorkflows();
    return res.status(200).json(workflows);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching workflows', error });
  }
};

// Get a specific workflow by ID
export const getWorkflow = async (req, res) => {
  const { workflowId } = req.params;
  try {
    const workflow = await getWorkflowById(workflowId);
    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }
    return res.status(200).json(workflow);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching workflow', error });
  }
};

export const executeWorkflow = async (req, res) => {
  const { workflowId } = req.params;
  let { nodes } = req.body; 
  const csvData = req.file.buffer; 

  try {
    const workflow = await getWorkflowById(workflowId);

    if (!workflow) {
      return res.status(404).json({ message: 'Workflow not found' });
    }

    if (typeof nodes === 'string') {
      nodes = JSON.parse(nodes);
    }

    let data = await convertCSVToJSON(csvData);

    // Array to store executed nodes
    const executedNodes = [];

    // Execute each node in the workflow
    for (const node of nodes) {
      data = await executeNode(node, data);
      executedNodes.push(node); 
    }

    // Save the execution result to the database
    const workflowExecution = new WorkflowExecution({
      workflowId: workflow._id,
      nodesExecuted: executedNodes, 
      data: data,
      executedAt: new Date(),
    });

    await workflowExecution.save();

    return res.status(200).json({
      message: 'Workflow executed and saved successfully',
      data,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error executing workflow', error });
  }
};


// Convert CSV binary data to JSON
const convertCSVToJSON = (csvBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const readableStream = Readable.from(csvBuffer.toString()); 

    readableStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
};

const executeNode = async (node, data) => {
  switch (node) {
    case 'filterData':
      return await filterData(data);
    case 'wait':
      await wait(60000); 
      return data; 
    case 'convertFormat':
      return await convertFormat(data);
    case 'sendPostRequest':
      return await sendPostRequest(data);
    default:
      return data;
  }
};

    const filterData = async (data) => {
  
  return data.map((row) => ({
    ...row,
    name: row.name && typeof row.name === 'string' ? row.name.toLowerCase() : row.name,
  }));
};


const wait = async (duration) => {
  return new Promise((resolve) => setTimeout(resolve, duration));
};

const convertFormat = async (data) => {
  return data;
};

const sendPostRequest = async (data) => {
  return data;
};
