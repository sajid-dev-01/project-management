import { AnalyticsCard } from "./analytics-card";

interface Props {
  data: {
    taskCount: number;
    taskDifference: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    completeTaskCount: number;
    completeTaskDifference: number;
    incompleteTaskCount: number;
    incompleteTaskDifference: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  };
}

const Analytics = ({ data }: Props) => {
  if (!data) return null;

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
      <AnalyticsCard
        title="Total tasks"
        value={data.taskCount}
        variant={data.taskDifference > 0 ? "up" : "down"}
        increaseValue={data.taskDifference}
      />
      <AnalyticsCard
        title="Assigned tasks"
        value={data.assignedTaskCount}
        variant={data.assignedTaskDifference > 0 ? "up" : "down"}
        increaseValue={data.assignedTaskDifference}
      />
      <AnalyticsCard
        title="Completed tasks"
        value={data.completeTaskCount}
        variant={data.completeTaskDifference > 0 ? "up" : "down"}
        increaseValue={data.completeTaskDifference}
      />
      <AnalyticsCard
        title="Overdue tasks"
        value={data.overdueTaskCount}
        variant={data.overdueTaskDifference > 0 ? "up" : "down"}
        increaseValue={data.overdueTaskDifference}
      />
      <AnalyticsCard
        title="Incomplete tasks"
        value={data.incompleteTaskCount}
        variant={data.incompleteTaskDifference > 0 ? "up" : "down"}
        increaseValue={data.incompleteTaskDifference}
      />
    </div>
  );
};

export default Analytics;
