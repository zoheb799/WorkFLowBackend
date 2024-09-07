import mongoose from 'mongoose';

const workflowExecutionSchema = new mongoose.Schema({
  workflowId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workflow',
    required: true,
  },
  nodesExecuted: {
    type: [String], 
    required: true,
  },
  data: {
    type: Object, 
    required: true,
  },
  executedAt: {
    type: Date,
    default: Date.now,
  },
});

const WorkflowExecution = mongoose.model('WorkflowExecution', workflowExecutionSchema);

export default WorkflowExecution;
