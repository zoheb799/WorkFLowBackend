import mongoose from 'mongoose';


const workflowSchema = new mongoose.Schema({
  workflowId: { type: String, required: true, unique: true },
  nodes: [String]  // Array of node types (strings)
});

 export const Workflow = mongoose.model('Workflow', workflowSchema);

 export const addWorkflow = async ({ workflowId, nodes }) => {
  const workflow = new Workflow({ workflowId, nodes });
  return await workflow.save();
};

export const getWorkflowById = async (workflowId) => {
  return await Workflow.findOne({ workflowId });
};

export const getAllWorkflows = async () => {
  return await Workflow.find({}, 'workflowId');
};

export default Workflow;
