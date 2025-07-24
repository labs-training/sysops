const cookie_name = "json2";
const main_title = "AWS SysOps Practice Quizzes - Hard";
 // --- DATA SOURCE ---
const questions = [
  {
    "number": 1,
    "title": "AWS Fleet Manager Hybrid Environment Configuration",
    "scenario": "A financial services company manages a large, hybrid fleet of thousands of Amazon EC2 instances and on-premises servers running a mix of Windows and Linux. They need a unified, secure method to apply critical OS patches and collect software inventory without initiating SSH or RDP sessions to each node. The on-premises servers have reliable network connectivity to AWS via a Direct Connect link, and all traffic to AWS services must not traverse the public internet.",
    "questionText": "Which combination of actions should the operations team take to establish the foundational connectivity and permissions for managing this hybrid fleet using AWS Systems Manager Fleet Manager? (Select TWO)",
    "isMultiChoice": true,
    "options": [
      { "letter": "A", "text": "Install the SSM Agent on all EC2 instances and on-premises servers. For the on-premises servers, create a Systems Manager activation to register them as managed nodes." },
      { "letter": "B", "text": "Configure the security groups for the EC2 instances to allow outbound HTTPS traffic to the public Systems Manager endpoints in the corresponding AWS Region." },
      { "letter": "C", "text": "Create and deploy a Systems Manager VPC interface endpoint in the VPC. Configure the on-premises DNS to resolve the Systems Manager service hostname to the private IP of the endpoint." },
      { "letter": "D", "text": "Use AWS Identity and Access Management (IAM) roles for EC2 instance profiles but rely on IAM users' access keys for authenticating the SSM Agent on-premises." },
      { "letter": "E", "text": "Create a single IAM role with the 'AmazonSSMManagedInstanceCore' policy and attach it to the EC2 instance profiles. Associate the same role with the on-premises Systems Manager activation." }
    ],
    "correctAnswers": [ "A", "C" ],
    "explanation": "Why A and C are correct: Option A is a fundamental requirement; the SSM Agent is necessary on every machine that needs to be managed by Systems Manager. For on-premises servers, a hybrid activation is the standard process to register them with the service. Option C addresses the critical security requirement that all traffic must remain private. Creating a VPC interface endpoint for Systems Manager allows both EC2 instances and on-premises servers (via Direct Connect) to communicate with the SSM API without sending traffic over the public internet. The on-premises DNS must be configured to resolve the service endpoint to the private IP of the VPC endpoint for this to work seamlessly.",
    "wrongExplanation": "Why the others are wrong:\nB: This contradicts the requirement that traffic must not traverse the public internet. Using a VPC endpoint makes this unnecessary and non-compliant.\nD: Using IAM user access keys for on-premises servers is not a best practice. The standard and more secure method is to use a Systems Manager activation which provides temporary credentials for registration, after which the agent manages its own identity securely.\nE: While creating an IAM role with 'AmazonSSMManagedInstanceCore' is correct, you cannot attach the same EC2 instance profile role directly to an on-premises activation. The activation process itself creates an association with an IAM role that grants permissions to the managed nodes."
  },
  {
    "number": 2,
    "title": "Elastic Load Balancing for gRPC Services",
    "scenario": "A company is deploying a set of microservices on Amazon ECS using the Fargate launch type. Several of these microservices communicate using the gRPC protocol for high-performance, real-time streaming. The services need to be exposed internally to other services within the VPC and must be load balanced for high availability and scalability. The solution must support end-to-end HTTP/2, which is a prerequisite for gRPC.",
    "questionText": "Which Elastic Load Balancing solution should be configured to meet these requirements?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "A Classic Load Balancer configured with a TCP listener." },
      { "letter": "B", "text": "A Gateway Load Balancer with a listener forwarding traffic to a fleet of proxy instances." },
      { "letter": "C", "text": "An Application Load Balancer with an HTTP listener and the protocol version set to gRPC." },
      { "letter": "D", "text": "A Network Load Balancer with a TLS listener, configured to pass through traffic to the Fargate tasks." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: The Application Load Balancer (ALB) is the only ELB type that provides native support for gRPC. It operates at Layer 7 and can manage HTTP/2 traffic end-to-end. By setting the protocol version of the target group to gRPC, the ALB can route gRPC calls to individual microservices, supporting features like health checks and path-based routing specific to gRPC services.",
    "wrongExplanation": "Why the others are wrong:\nA: A Classic Load Balancer is a legacy product and does not support gRPC or HTTP/2. It operates primarily at Layer 4 (TCP) or Layer 7 (HTTP/1.1).\nB: A Gateway Load Balancer is designed for deploying and managing third-party virtual network appliances, not for application load balancing like gRPC.\nD: While a Network Load Balancer (NLB) operates at Layer 4 and can handle any TCP traffic, including gRPC, it does not understand the gRPC protocol itself. It cannot perform Layer 7 routing or terminate HTTP/2, meaning it doesn't provide the advanced routing and management features an ALB offers for gRPC. An ALB is the purpose-built solution."
  },
  {
    "number": 3,
    "title": "Amazon Route 53 Resolver Hybrid DNS Resolution",
    "scenario": "A company has a hybrid cloud setup with a significant on-premises data center connected to an AWS VPC via AWS Direct Connect. The on-premises network has its own DNS servers that manage internal hostnames (e.g., 'server.internal.corp'). The applications running on EC2 instances within the VPC need to resolve these on-premises hostnames. Conversely, on-premises servers need to resolve the private hostnames of AWS resources (e.g., EC2 instances, RDS databases) in the VPC. The solution must be highly available and managed by AWS.",
    "questionText": "How can the company configure DNS resolution to work seamlessly and bi-directionally between the VPC and the on-premises data center?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Deploy an Amazon EC2 instance running BIND DNS software in the VPC. Configure it to forward requests for '.internal.corp' to the on-premises DNS servers and set it as the primary DNS server for the VPC." },
      { "letter": "B", "text": "Create a Route 53 private hosted zone for the VPC and manually create A records for all on-premises servers, updating them whenever an IP changes." },
      { "letter": "C", "text": "Configure a Route 53 Resolver outbound endpoint to forward queries for '.internal.corp' to the on-premises DNS servers. Configure a Route 53 Resolver inbound endpoint and have the on-premises DNS servers conditionally forward queries for the VPC's domain to the inbound endpoint's IP addresses." },
      { "letter": "D", "text": "Create a Route 53 public hosted zone for '.internal.corp' and point its records to the private IP addresses of the on-premises servers. Configure the on-premises DNS to use Route 53 as a resolver." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: This describes the exact use case for Route 53 Resolver endpoints. An outbound endpoint allows DNS queries originating from within the VPC to be forwarded to an external DNS server (in this case, on-premises). An inbound endpoint allows DNS queries originating from outside the VPC (on-premises) to resolve AWS resources within the VPC. This creates a managed, highly available, and bi-directional bridge for hybrid DNS resolution without requiring self-managed DNS servers on EC2.",
    "wrongExplanation": "Why the others are wrong:\nA: This solution would work, but it introduces the operational overhead of managing, patching, and ensuring the high availability of the EC2 DNS instance, which is contrary to the preference for a managed AWS solution.\nB: This is not scalable or practical. Manually managing records for a dynamic on-premises environment would be a significant operational burden and prone to errors.\nC: Using a public hosted zone for internal, private IP addresses is incorrect and insecure. It would expose internal network structure and would not be resolvable from the on-premises environment without significant and complex workarounds."
  },
  {
    "number": 4,
    "title": "Scaling with AWS Auto Scaling for Mixed Workloads",
    "scenario": "An e-commerce platform runs its primary application on a fleet of EC2 instances within an Auto Scaling group (ASG). During business hours (9 AM - 6 PM), the application experiences high, predictable traffic. Outside of business hours, traffic is low but subject to sudden, unpredictable spikes from international marketing campaigns. The company wants to optimize costs while ensuring the application can handle both predictable and unpredictable traffic patterns effectively.",
    "questionText": "What combination of scaling policies should a solutions architect implement on the Auto Scaling group to achieve this? (Select TWO)",
    "isMultiChoice": true,
    "options": [
      { "letter": "A", "text": "A step scaling policy based on a custom CloudWatch metric that measures the number of active user sessions." },
      { "letter": "B", "text": "A scheduled scaling action to increase the desired capacity to a higher baseline at 9 AM and decrease it at 6 PM on weekdays." },
      { "letter": "C", "text": "A simple scaling policy that adds two instances whenever the average CPU utilization exceeds 70%." },
      { "letter": "D", "text": "A target tracking scaling policy based on the 'ASGAverageCPUUtilization' predefined metric, with a target value of 60%." },
      { "letter": "E", "text": "Enable predictive scaling in forecast-only mode to analyze the traffic patterns without affecting capacity." }
    ],
    "correctAnswers": [ "B", "D" ],
    "explanation": "Why B and D are correct: This scenario requires a hybrid approach to scaling. Option B, scheduled scaling, is perfect for handling the predictable traffic patterns during business hours. It proactively scales the environment out and in at specific times, ensuring capacity is ready before the load increases. Option D, target tracking, is the ideal way to handle the unpredictable spikes. It automatically adjusts the number of instances to keep the average CPU utilization at the desired target (60%), providing a responsive and dynamic scaling mechanism for sudden traffic changes. Combining these two policies provides a robust and cost-effective solution.",
    "wrongExplanation": "Why the others are wrong:\nA: Step scaling is a valid policy type, but target tracking is generally preferred for its simplicity and effectiveness in maintaining a specific metric target. A custom metric also adds complexity compared to the standard CPU utilization metric, which is often sufficient.\nC: Simple scaling is a legacy policy type that is generally not recommended. It has a cooldown period that can lead to slower response times compared to step or target tracking policies.\nE: Predictive scaling in forecast-only mode is a useful tool for analysis, but it does not actually perform any scaling actions. To handle the load, the policy must be set to 'Forecast and scale'."
  },
  {
    "number": 5,
    "title": "Scaling with Spot Instances for Fault-Tolerant Workloads",
    "scenario": "A data analytics company runs large-scale batch processing jobs that can take several hours to complete. These jobs run on a fleet of EC2 instances managed by an Auto Scaling group. The jobs are designed to be fault-tolerant and can resume from checkpoints if interrupted. The company wants to significantly reduce compute costs for these jobs. The ASG is configured to use multiple instance types (e.g., m5.large, c5.large, r5.large) to improve the chances of acquiring capacity.",
    "questionText": "What is the most cost-effective and resilient strategy for configuring the Auto Scaling group?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Configure the ASG with a 100% On-Demand base capacity and set the 'InstancesDistribution' to use the 'lowest-price' allocation strategy for Spot Instances." },
      { "letter": "B", "text": "Configure the ASG with a 0% On-Demand base, a 100% Spot Instance percentage, and use the 'capacity-optimized' allocation strategy." },
      { "letter": "C", "text": "Configure the ASG with a 100% Spot Instance percentage and set a Spot Max Price significantly higher than the current Spot price to prevent interruptions." },
      { "letter": "D", "text": "Create separate Auto Scaling groups for each instance type, each bidding for Spot Instances, and use AWS Batch to manage job distribution." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: Since the workload is fault-tolerant and the primary goal is cost reduction, using 100% Spot Instances is the most cost-effective approach. The key to resilience with Spot is the allocation strategy. The 'capacity-optimized' strategy is the best practice because it instructs Auto Scaling to request Spot Instances from the pools with the deepest capacity, which minimizes the likelihood of a Spot Instance interruption. This is more effective at preventing interruptions than bidding high.",
    "wrongExplanation": "Why the others are wrong:\nA: A 100% On-Demand base defeats the purpose of extreme cost savings. The 'lowest-price' allocation strategy is not recommended for long-running jobs, as it often targets pools with less available capacity, increasing the risk of interruption.\nC: Setting a high Spot Max Price does not prevent your instance from being reclaimed when AWS needs the capacity back. It only protects against your instance being terminated due to the Spot price exceeding your bid. The primary reason for Spot interruptions is capacity reclamation, which is mitigated by the 'capacity-optimized' strategy.\nD: While AWS Batch is a good service for this use case, creating separate ASGs for each instance type is an outdated and inefficient pattern. Modern ASGs can manage a mix of instance types and purchase options within a single group, which is far simpler and more effective."
  },
  {
    "number": 6,
    "title": "VPC Flow Logs for Security Anomaly Detection",
    "scenario": "A security team needs to analyze network traffic to and from a critical application server with a specific private IP address (10.0.1.123) in their VPC. They suspect the server is being targeted by a slow port scan from an unknown internal source. They need to capture all accepted and rejected traffic for this specific network interface and analyze it for unusual patterns without impacting the performance of the server. The logs must be retained for long-term forensic analysis.",
    "questionText": "What is the most efficient method to capture and analyze the required traffic data?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Install a packet-sniffing agent like tcpdump on the EC2 instance and stream the output to an Amazon S3 bucket for analysis." },
      { "letter": "B", "text": "Enable VPC Flow Logs at the VPC level, filtering for 'REJECT' traffic, and publish the logs to Amazon CloudWatch Logs. Use CloudWatch Logs Insights to query for the source IP." },
      { "letter": "C", "text": "Enable VPC Flow Logs on the specific Elastic Network Interface (ENI) of the application server. Publish the logs to an Amazon S3 bucket with a custom format that includes 'pkt-srcaddr' and 'pkt-dstaddr' fields. Use Amazon Athena to query the logs." },
      { "letter": "D", "text": "Configure a traffic mirroring session to copy all traffic from the application server's ENI to a dedicated security monitoring EC2 instance for real-time analysis." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: VPC Flow Logs are the native AWS tool for capturing IP traffic information. Enabling them at the specific ENI level is the most targeted and efficient approach, as it avoids capturing irrelevant traffic from the rest of the VPC. Publishing to S3 is ideal for long-term retention and cost-effective analysis. Using a custom log format to include packet-level source and destination addresses ('pkt-srcaddr', 'pkt-dstaddr') can provide more detailed insights, especially through NAT gateways or other intermediate hops. Amazon Athena is the perfect tool for running complex SQL queries on this data stored in S3 to identify patterns like a port scan.",
    "wrongExplanation": "Why the others are wrong:\nA: Installing agents directly on the instance can impact its performance and adds operational overhead for managing the agent software. This is less efficient than using the native VPC Flow Logs feature.\nB: Enabling logs at the VPC level will capture far more data than necessary, increasing costs and making queries slower. Filtering only for 'REJECT' traffic is insufficient, as a successful but malicious connection would be 'ACCEPT' traffic. A slow scan might not generate many rejections initially.\nD: Traffic mirroring is a powerful tool for deep packet inspection, but it is more complex to set up and generally used for real-time intrusion detection systems. For the described use case of retrospective log analysis, VPC Flow Logs are simpler, more cost-effective, and sufficient."
  },

  {
    "number": 7,
    "title": "Managing Licenses with AWS License Manager",
    "scenario": "A company is migrating a legacy application to AWS. The application uses a commercial database software that is licensed based on the number of vCPUs. They have 100 vCPU licenses and want to ensure that they never run more EC2 instances than their license agreement allows across all their development and production AWS accounts, which are managed under AWS Organizations. They also want to prevent the launch of unapproved instance types (e.g., very large instances that would consume too many licenses).",
    "questionText": "Which set of actions should the administrator perform using AWS License Manager to enforce these licensing rules? (Select TWO)",
    "isMultiChoice": true,
    "options": [
      { "letter": "A", "text": "Create a license configuration with a hard limit of 100 vCPUs and a rule to track instances by vCPU." },
      { "letter": "B", "text": "In the management account, share the license configuration with the entire organization via AWS Resource Access Manager (RAM)." },
      { "letter": "C", "text": "Create an IAM policy that denies the 'ec2:RunInstances' action if the instance AMI is not associated with the license configuration." },
      { "letter": "D", "text": "Configure Amazon Inspector to scan all running instances and send an alert if the total vCPU count exceeds 100." },
      { "letter": "E", "text": "Attach the license configuration to the launch templates and AMIs used to deploy the database servers. This will enforce the license rules at launch time." }
    ],
    "correctAnswers": [ "A", "E" ],
    "explanation": "Why A and E are correct: Option A is the core of the solution. The administrator must create a license configuration in AWS License Manager that reflects the terms of their agreement, specifically setting a hard limit on the number of vCPUs. Option E is the enforcement mechanism. By associating this license configuration with the specific AMIs or launch templates used to deploy the application, License Manager can automatically track license usage. If launching a new instance would exceed the 100 vCPU limit, the launch action will fail, thus providing hard enforcement.",
    "wrongExplanation": "Why the others are wrong:\nB: Sharing the configuration is necessary for multi-account governance, but it's a distribution step, not the core enforcement action. The enforcement itself happens by attaching the configuration to resources (AMIs/launch templates).\nC: This is an overly complex and brittle way to enforce the rule. License Manager is designed to handle this natively without requiring custom IAM policies that would be difficult to maintain.\nD: Amazon Inspector is a vulnerability assessment service. It does not track license usage. This is a detection mechanism, not a preventative one, and it uses the wrong tool for the job."
  },
  {
    "number": 8,
    "title": "Monitoring and Maintaining Healthy Workloads",
    "scenario": "A critical, customer-facing application is deployed across multiple EC2 instances in an Auto Scaling group behind an Application Load Balancer (ALB). The development team has noticed that occasionally, specific instances become unhealthy and start returning 5xx errors, but only for certain API paths (e.g., '/api/v2/process'). The default ALB health checks, which target the root path ('/'), report the instances as healthy, leading to a poor customer experience as traffic is still routed to the failing instances.",
    "questionText": "What is the most effective way to improve the health check mechanism to ensure failing instances are quickly removed from service?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Configure the Auto Scaling group to use EC2 status checks instead of ELB health checks to determine instance health." },
      { "letter": "B", "text": "Create a custom health check script on each instance that monitors the application logs for 5xx errors and calls the 'SetInstanceHealth' API action to manually fail the instance." },
      { "letter": "C", "text": "Modify the ALB health check configuration for the target group to ping a specific, deep health check endpoint (e.g., '/api/health') that validates all critical application dependencies." },
      { "letter": "D", "text": "Increase the 'HealthyThresholdCount' and decrease the 'Interval' for the existing ALB health check to make it more sensitive to failures." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: The problem is that the current health check ('/') is not representative of the application's true health. The best practice is to create a dedicated health check endpoint (e.g., '/api/health') within the application. This endpoint should perform a comprehensive check of its own state and its dependencies (like database connectivity or other microservices). By pointing the ALB health check to this specific path, the load balancer gets a much more accurate signal of the instance's ability to serve traffic correctly, allowing it to quickly remove truly unhealthy instances.",
    "wrongExplanation": "Why the others are wrong:\nA: EC2 status checks only verify the health of the underlying hypervisor and the instance's reachability. They have no knowledge of the application's state and would not detect the 5xx errors.\nB: This is a complex, custom solution that re-implements functionality already available in the ALB. It's less reliable and harder to maintain than using the built-in health check features.\nD: Tweaking the thresholds of an ineffective health check will not solve the core problem. If the check on '/' is always succeeding, making it more sensitive is useless. The target of the check itself needs to be changed."
  },
  {
    "number": 9,
    "title": "Monitoring AWS Infrastructure with Anomaly Detection",
    "scenario": "A company runs a stable, critical backend API on AWS Fargate. The service typically has very predictable CPU and memory utilization patterns. The operations team wants to be alerted proactively to any abnormal behavior that could indicate a potential problem, such as a memory leak or an infinite loop in the code, before it escalates into a full-blown outage. They want a solution that minimizes manual threshold configuration and adapts to evolving patterns over time.",
    "questionText": "Which monitoring strategy should the team implement?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Create standard CloudWatch alarms for CPU and Memory utilization with static thresholds determined from historical data." },
      { "letter": "B", "text": "Enable CloudWatch Anomaly Detection on the CPUUtilization and MemoryUtilization metrics for the Fargate service and create alarms that trigger based on the anomaly detection band." },
      { "letter": "C", "text": "Stream CloudWatch metrics to an Amazon OpenSearch Service cluster and use its machine learning features to detect anomalies." },
      { "letter": "D", "text": "Use AWS Compute Optimizer to generate recommendations and create an EventBridge rule to send an alert when a 'Not Optimized' finding is reported." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: CloudWatch Anomaly Detection is the purpose-built AWS service for this exact scenario. It uses machine learning models to analyze a metric's historical data, establish a normal baseline (the 'band'), and identify unusual spikes or dips that deviate from this baseline. This avoids the brittleness of static thresholds, which need to be manually adjusted and may not catch subtle, slow-building issues. Creating an alarm based on the anomaly detection model provides the desired proactive and adaptive alerting.",
    "wrongExplanation": "Why the others are wrong:\nA: Static thresholds are exactly what the team wants to avoid. They are difficult to set correctly and can lead to either false positives or missed alerts as application behavior evolves.\nC: While this is technically possible, it's a much more complex and expensive solution than using the native CloudWatch Anomaly Detection feature. It requires setting up and managing an entire OpenSearch cluster and its ML capabilities.\nD: AWS Compute Optimizer is focused on right-sizing recommendations (i.e., whether a resource is over-provisioned or under-provisioned). It is not a real-time anomaly detection tool for performance metrics like CPU or memory."
  },
  {
    "number": 10,
    "title": "Monitoring AWS Applications with CloudWatch Synthetics",
    "scenario": "An online retail company has a critical multi-step checkout process that involves several API calls and user interface interactions across their website. They want to continuously verify that this entire user journey is functional and performing within acceptable latency limits from different geographic locations. A failure in any step of the checkout process should trigger a high-priority alarm for the on-call team. The solution should simulate real user behavior as closely as possible.",
    "questionText": "Which AWS service should be used to meet these monitoring requirements?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Create a set of CloudWatch alarms based on the Application Load Balancer's 'HTTPCode_Target_5XX_Count' and 'TargetResponseTime' metrics." },
      { "letter": "B", "text": "Use CloudWatch Synthetics to create a canary that runs a script simulating the user's journey through the checkout process, and configure alarms on the canary's success rate and duration." },
      { "letter": "C", "text": "Deploy a fleet of EC2 instances in various AWS Regions to run a Selenium script in a loop and send custom metrics to CloudWatch." },
      { "letter": "D", "text": "Use AWS X-Ray to trace the requests through the application and create an alarm if the trace duration for the checkout API exceeds a certain threshold." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: CloudWatch Synthetics is designed for this exact purpose. It allows you to create 'canaries,' which are configurable scripts (using Puppeteer or Selenium) that run on a schedule to monitor your endpoints and UI flows. You can script a complete multi-step user journey, like the checkout process, and Synthetics will automatically collect metrics on success, failure, and latency for each run. Alarms can be easily configured on these metrics, providing proactive, end-to-end monitoring of the user experience.",
    "wrongExplanation": "Why the others are wrong:\nA: ALB metrics can tell you if there are errors or high latency at the load balancer level, but they cannot verify a multi-step business transaction. A simple health check might pass while the logic for the checkout flow is broken.\nC: This is a self-managed, complex version of what CloudWatch Synthetics provides as a managed service. It would require significant operational effort to build, deploy, and maintain.\nD: AWS X-Ray is excellent for tracing and debugging requests once they are inside your application infrastructure. However, it does not monitor the application from an external, user-centric perspective. It won't tell you if a CDN issue or a DNS problem is preventing users from even reaching your application in the first place."
  },
  {
    "number": 11,
    "title": "AWS X-Ray Trace Analysis in Microservices",
    "scenario": "A serverless application consists of an Amazon API Gateway endpoint that triggers an AWS Lambda function. This function then writes to a DynamoDB table and sends a message to an SQS queue. A separate Lambda function processes messages from the SQS queue. The development team is using AWS X-Ray to trace requests through this entire workflow. They observe that in the X-Ray service map, the trace context is being lost between the SQS queue and the second Lambda function; the processor Lambda appears as a new, separate trace.",
    "questionText": "What is the most likely cause for the broken trace context?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "The IAM execution role for the second Lambda function is missing permissions to write data to X-Ray." },
      { "letter": "B", "text": "Active tracing has not been enabled on the SQS queue itself in the SQS console." },
      { "letter": "C", "text": "The code in the first Lambda function is not propagating the trace header when sending the message to SQS." },
      { "letter": "D", "text": "The code in the second Lambda function is not using an AWS SDK that is patched for X-Ray to extract the trace header from the SQS message event." }
    ],
    "correctAnswers": [ "D" ],
    "explanation": "Why D is correct: For asynchronous event-driven architectures like this one, the trace context (Trace ID) must be passed along with the event payload (the SQS message). While Lambda automatically instruments calls it makes with a patched SDK, when it is *invoked* by a service like SQS, the Lambda runtime itself needs to read the incoming trace header from the event source. The AWS SDK for Lambda (e.g., in the Lambda Powertools library) is specifically designed to do this automatically. If the developer is not using an X-Ray-aware SDK or is manually processing the SQS message event without extracting the trace header, the context will be lost, and X-Ray will initiate a new trace.",
    "wrongExplanation": "Why the others are wrong:\nA: If the IAM role were missing permissions, there would be no segments from the second Lambda function at all, not just a broken trace. The function wouldn't be able to report its own data to X-Ray.\nB: SQS as a service does not have an 'Active Tracing' button like Lambda or API Gateway. The propagation of trace context is the responsibility of the message producer and consumer.\nC: When using a supported AWS SDK (like Boto3 for Python or the AWS SDK for Node.js) from within a Lambda function with active tracing enabled, the SDK automatically injects the trace header into the SQS message attributes. It's unlikely this is the issue unless the developer is using a non-standard method to send the message."
  },
  {
    "number": 12,
    "title": "Amazon EventBridge Complex Event Filtering",
    "scenario": "An operations team is using Amazon EventBridge to react to events from AWS Health. They want to create a rule that triggers an AWS Lambda function notification only for specific, high-impact events. The rule must match events that originate from the 'aws.health' source, are for the 'AWS_EC2_INSTANCE_STOP_WARNING' event type, and affect resources located exclusively in the 'eu-central-1' region. Events for any other region or event type should be ignored.",
    "questionText": "Which event pattern should be used in the EventBridge rule to correctly filter for these specific events?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "{ \"source\": [\"aws.health\"], \"detail-type\": [\"AWS Health Event\"], \"detail\": { \"service\": [\"EC2\"], \"eventTypeCategory\": [\"issue\"], \"region\": [\"eu-central-1\"] } }"
      },
      {
        "letter": "B",
        "text": "{ \"source\": [\"aws.health\"], \"detail\": { \"eventTypeCode\": [\"AWS_EC2_INSTANCE_STOP_WARNING\"], \"affectedAccount\": [\"123456789012\"] } }"
      },
      {
        "letter": "C",
        "text": "{ \"source\": [\"aws.health\"], \"region\": [\"eu-central-1\"], \"detail\": { \"eventTypeCode\": [\"AWS_EC2_INSTANCE_STOP_WARNING\"] } }"
      },
      {
        "letter": "D",
        "text": "{ \"source\": [\"aws.health\"], \"detail-type\": [\"AWS Health Event\"], \"resources\": [ { \"region\": \"eu-central-1\" } ], \"detail\": { \"eventTypeCode\": [\"AWS_EC2_INSTANCE_STOP_WARNING\"] } }"
      }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: This event pattern correctly uses the top-level 'region' field to filter events based on the AWS Region where the event originated. It also correctly navigates into the 'detail' object to filter by the specific 'eventTypeCode' provided by AWS Health events. This combination ensures that only the EC2 stop warnings from the 'eu-central-1' region will match the rule.",
    "wrongExplanation": "Why the others are wrong:\nA: This pattern is too broad. It filters on the service being EC2 and the category being 'issue', but it doesn't specify the exact 'eventTypeCode', so it would match many other EC2-related health events. The region filter is also misplaced inside the detail object; it's a top-level attribute.\nB: This pattern correctly identifies the event type code but lacks the crucial filter for the 'eu-central-1' region. It also includes an unnecessary filter on the account ID.\nD: The 'resources' field in an event pattern is used to match the ARNs of affected resources, not to filter by attributes like region. The region filter must be a top-level field in the pattern as shown in C."
  },
  {
    "number": 13,
    "title": "AWS IAM Access Analyzer for External Access",
    "scenario": "A company has a strict security policy that prohibits any S3 buckets from being publicly accessible or accessible by other AWS accounts outside of their AWS Organization. A security engineer needs to implement a continuous, automated mechanism to detect any policy violations across all existing and future S3 buckets. When a non-compliant policy is detected, an alert should be generated for immediate remediation.",
    "questionText": "Which AWS service should the engineer configure to meet this requirement?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Create an AWS Config rule with the 's3-bucket-public-read-prohibited' managed rule and another custom rule to check for cross-account access." },
      { "letter": "B", "text": "Configure AWS IAM Access Analyzer for the organization, defining the organization's zone of trust. Review findings with the status 'Active' for external access." },
      { "letter": "C", "text": "Enable AWS GuardDuty and monitor for 'Policy:S3/BucketPublicAccessGranted' findings." },
      { "letter": "D", "text": "Write a custom AWS Lambda function that runs on a schedule, uses the 'ListBuckets' and 'GetBucketPolicy' APIs to inspect every bucket, and sends an SNS notification if a violation is found." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: AWS IAM Access Analyzer is the service specifically designed for this use case. It uses logical reasoning (provable security) to analyze resource-based policies (like S3 bucket policies) to identify which resources can be accessed from outside a defined 'zone of trust'. By configuring the analyzer at the organization level and defining the organization as the zone of trust, it will automatically and continuously monitor all supported resources (including S3 buckets) in all member accounts. It will generate a 'finding' for any bucket policy that grants access to an external entity, fulfilling the requirement perfectly.",
    "wrongExplanation": "Why the others are wrong:\nA: AWS Config is a valid way to check for compliance, but it is less comprehensive than IAM Access Analyzer for this specific task. Config rules check against specific conditions, while Access Analyzer performs a more formal analysis of the entire policy. Setting up custom rules for all forms of cross-account access can be complex.\nC: GuardDuty is a threat detection service. It would detect if a bucket was made public, but its primary focus is on detecting malicious activity or unauthorized behavior, not on preventative policy analysis. IAM Access Analyzer proactively identifies the permissive policy itself, even if no one has accessed it yet.\nD: This is a manual, custom solution that requires significant development and maintenance effort. IAM Access Analyzer provides this functionality as a fully managed service."
  },
  {
    "number": 14,
    "title": "AWS Config Rules for Multi-Account Compliance",
    "scenario": "A large enterprise uses AWS Organizations to manage dozens of AWS accounts. The central governance team wants to enforce a rule that all Amazon EBS volumes across all accounts must be encrypted. They need a solution that can automatically deploy this compliance rule to all existing and new accounts as they are added to the organization. Additionally, they want to centrally view the compliance status of all accounts from the organization's management account.",
    "questionText": "What is the most efficient and scalable way to deploy and manage this compliance rule? (Select TWO)",
    "isMultiChoice": true,
    "options": [
      { "letter": "A", "text": "In the management account, use AWS CloudFormation StackSets to deploy a stack containing the 'encrypted-volumes' AWS Config managed rule to all accounts in the organization." },
      { "letter": "B", "text": "In each member account, manually create the 'encrypted-volumes' AWS Config managed rule and configure it to send data to a central S3 bucket." },
      { "letter": "C", "text": "Create a custom Lambda function that assumes a role in each member account, checks for unencrypted EBS volumes, and writes the results to a DynamoDB table in the management account." },
      { "letter": "D", "text": "From the management account, deploy an organization conformance pack that includes the 'encrypted-volumes' managed rule." },
      { "letter": "E", "text": "From the management account, configure an AWS Config aggregator to collect compliance data from all member accounts." }
    ],
    "correctAnswers": [ "D", "E" ],
    "explanation": "Why D and E are correct: AWS Config offers native integration with AWS Organizations for this purpose. Option D, using an organization conformance pack, is the modern, recommended way to deploy a common set of compliance rules across an entire organization or specific OUs. It automatically handles deployment to new and existing accounts. Option E, creating an aggregator, is the necessary second step. The aggregator, configured in the management or a designated administrator account, collects all the configuration and compliance data from the source accounts, providing a centralized dashboard for viewing the compliance status of the entire organization.",
    "wrongExplanation": "Why the others are wrong:\nA: While CloudFormation StackSets can be used to deploy resources across accounts and was a common method before organization-level features were added to Config, conformance packs are now the purpose-built, simpler, and more powerful tool for managing compliance rules at scale.\nB: This manual approach is not scalable and is prone to human error. It does not automatically apply the rule to new accounts.\nC: This is a completely custom, manual implementation of what AWS Config and its organizational features provide as a managed service. It would be expensive to build and brittle to maintain."
  },
  {
    "number": 15,
    "title": "Amazon Inspector for Container Image Vulnerability Scanning",
    "scenario": "A DevOps team is building a CI/CD pipeline using AWS CodePipeline to build and deploy containerized applications to Amazon ECR (Elastic Container Registry). A new security mandate requires that no container image with 'CRITICAL' or 'HIGH' severity vulnerabilities can be deployed to the production ECR repository. The team needs to integrate an automated vulnerability scan into the pipeline that can block the deployment if a non-compliant image is found. The solution must be efficient and tightly integrated with AWS services.",
    "questionText": "How should the team configure the CI/CD pipeline to enforce this security requirement?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Configure ECR scan on push for the repository. In a subsequent CodePipeline stage, use a Lambda function to invoke the ECR 'DescribeImageScanFindings' API and fail the pipeline if 'CRITICAL' or 'HIGH' vulnerabilities are present." },
      { "letter": "B", "text": "Add a stage in CodePipeline to launch the container on a temporary EC2 instance and run an Amazon Inspector classic assessment against it." },
      { "letter": "C", "text": "Enable Amazon GuardDuty for ECR and configure an EventBridge rule to stop the pipeline execution if a vulnerability is found." },
      { "letter": "D", "text": "Configure an Amazon Inspector scan of the ECR repository and create an EventBridge rule that listens for scan completion events with a 'failed' status to trigger a pipeline stop action." }
    ],
    "correctAnswers": [ "A" ],
    "explanation": "Why A is correct: This is the standard, event-driven pattern for integrating ECR scanning into a CI/CD pipeline. ECR's 'scan on push' feature automatically initiates a vulnerability scan (powered by Amazon Inspector) as soon as a new image is pushed. This is highly efficient. The scan completion event can then trigger the next stage of the pipeline. A Lambda function is the perfect tool to query the scan results using the API. The function can parse the findings, check the severity, and if it finds 'CRITICAL' or 'HIGH' vulnerabilities, it can call the `PutJobFailureResult` action in CodePipeline to stop the deployment.",
    "wrongExplanation": "Why the others are wrong:\nB: Inspector classic is deprecated, and scanning a running container on a temporary instance is inefficient and complex compared to scanning the static image in ECR.\nC: GuardDuty is a threat detection service, not a vulnerability scanner. It would not scan the ECR image for known CVEs.\nD: While Inspector does scan ECR repositories, orchestrating this directly from CodePipeline as described in A is more direct. Waiting for a generic 'failed' event is less precise than actively querying the results and making a decision based on the severity levels as required by the scenario."
  },
  {
    "number": 16,
    "title": "AWS GuardDuty Finding Triage",
    "scenario": "A security analyst is reviewing AWS GuardDuty findings in a large AWS environment. They notice a large number of 'Recon:EC2/PortProbeUnprotectedPort' findings with a 'Low' severity. These findings are all related to specific EC2 instances that are intentionally running a public web server on port 80, and the traffic is from legitimate health check services. The analyst wants to reduce the noise from these benign findings so they can focus on more critical threats, without completely disabling the finding type.",
    "questionText": "What is the most appropriate action for the analyst to take?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Disable the 'Recon:EC2/PortProbeUnprotectedPort' finding type in the GuardDuty settings." },
      { "letter": "B", "text": "Create a suppression rule in GuardDuty with a filter for the finding type and conditions that match the IP addresses of the health check services." },
      { "letter": "C", "text": "Create a trusted IP list in GuardDuty that includes the IP addresses of the health check services." },
      { "letter": "D", "text": "Manually archive all the existing 'Low' severity findings and create a CloudWatch alarm to only trigger on 'Medium' or 'High' severity findings." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: Suppression rules are the specific GuardDuty feature designed for this exact use case. They allow you to create filters based on finding attributes (like finding type, actor's IP address, resource ARN, etc.) to automatically archive new findings that match the criteria. This reduces noise without disabling the entire detector, meaning a true port probe from an unknown source would still generate an alert. This is more precise than using a trusted IP list.",
    "wrongExplanation": "Why the others are wrong:\nA: Disabling the finding type entirely is too broad. It would prevent GuardDuty from alerting on actual malicious port probes from other sources.\nC: A trusted IP list tells GuardDuty that any activity from those IPs should be considered safe and not be included in findings. While this might work, a suppression rule is more granular. A trusted IP list applies to *all* finding types, which might have unintended consequences if one of the health check servers were ever compromised. A suppression rule can be scoped to just the port probe finding type from those specific IPs.\nD: Manually archiving findings is a one-time action and doesn't prevent new ones from appearing. Relying on CloudWatch alarms to filter is a post-processing step; the goal is to prevent the findings from cluttering the GuardDuty console in the first place."
  },
  {
    "number": 17,
    "title": "AWS Networking at the Edge with Global Accelerator",
    "scenario": "A global gaming company hosts its application servers on EC2 instances behind Network Load Balancers (NLBs) in two AWS Regions: `us-east-1` and `ap-southeast-1`. They need to provide a single, static entry point for their users worldwide and route them to the region with the lowest latency. The solution must also provide instant failover between regions if the application in one region becomes unhealthy. The application communicates over a custom TCP protocol, not HTTP.",
    "questionText": "Which combination of AWS services and configurations should be used to meet all these requirements? (Select TWO)",
    "isMultiChoice": true,
    "options": [
      { "letter": "A", "text": "Create an Amazon CloudFront distribution with the NLBs as origins and use Lambda@Edge to route users based on latency." },
      { "letter": "B", "text": "Deploy an AWS Global Accelerator and configure it with endpoint groups in both 'us-east-1' and 'ap-southeast-1'." },
      { "letter": "C", "text": "Add the Regional Network Load Balancers as endpoints to their respective endpoint groups in Global Accelerator." },
      { "letter": "D", "text": "Use Amazon Route 53 with a latency-based routing policy pointing to the DNS names of the two NLBs." },
      { "letter": "E", "text": "Configure client-side logic within the game to ping both NLBs and connect to the one with the fastest response." }
    ],
    "correctAnswers": [ "B", "C" ],
    "explanation": "Why B and C are correct: AWS Global Accelerator is the perfect service for this use case. Option B is the first step: creating the accelerator provides two static anycast IP addresses that serve as the single entry point for all users. Global Accelerator then routes user traffic over the AWS global network to the optimal endpoint. Option C is the second step: the 'endpoints' for Global Accelerator can be NLBs, ALBs, or EC2 instances. By adding the regional NLBs to endpoint groups, you connect the accelerator to your application. Global Accelerator continuously monitors the health of these endpoints and will automatically fail over traffic to the healthy region in seconds if an issue is detected, fulfilling the instant failover requirement.",
    "wrongExplanation": "Why the others are wrong:\nA: CloudFront is a cache and content delivery network designed primarily for HTTP/HTTPS traffic. It is not suitable for custom TCP protocols.\nD: Route 53 latency-based routing works at the DNS level. While it can route users to the nearest region, it is subject to DNS caching, which can delay failover significantly (from minutes to hours). Global Accelerator provides near-instant failover at the IP level.\nE: Building this logic into the client is complex, brittle, and shifts the burden of failover and latency routing from the infrastructure to the application, which is not a scalable or reliable approach."
  },
  {
    "number": 18,
    "title": "AWS CloudFront Origin Shield and Cache Optimization",
    "scenario": "A media company uses Amazon CloudFront to deliver video-on-demand content stored in an Amazon S3 bucket. They have a global audience, and they've noticed that their S3 data transfer costs are higher than expected due to a high cache miss rate. Many requests are being forwarded from various CloudFront edge locations directly to the S3 origin for the same piece of content. They want to reduce the load on the S3 origin and improve the cache hit ratio.",
    "questionText": "What should the company do to most effectively reduce origin load and improve the cache hit ratio?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Increase the TTLs in the cache policy for the CloudFront distribution to cache objects for a longer duration." },
      { "letter": "B", "text": "Enable CloudFront Origin Shield in a region that is geographically central to the S3 origin bucket." },
      { "letter": "C", "text": "Create a second CloudFront distribution and chain them together, with the first distribution using the second as its origin." },
      { "letter": "D", "text": "Replicate the S3 bucket content to multiple regions and configure a latency-based routing policy in Route 53." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: CloudFront Origin Shield is a feature designed specifically for this problem. It acts as an additional caching layer between the CloudFront edge locations and your origin. When you enable Origin Shield, all requests from all edge locations for a cache miss are funneled through the designated Origin Shield regional edge cache. This regional cache then makes a single request to the origin if needed. This dramatically collapses the number of requests hitting the origin (S3 bucket), reducing costs and improving the overall cache hit ratio.",
    "wrongExplanation": "Why the others are wrong:\nA: While increasing TTLs can help, it doesn't solve the fundamental problem of multiple edge locations independently requesting the same content from the origin when their caches expire. Origin Shield addresses this consolidation problem directly.\nC: Chaining distributions is a complex and unsupported workaround that mimics what Origin Shield does as a managed feature. It's not a recommended or efficient solution.\nD: This adds significant complexity and cost by replicating data. The issue is with cache efficiency, not origin latency. CloudFront is already designed to handle global delivery from a single origin; the goal is to make that interaction more efficient, which is what Origin Shield does."
  },
  {
    "number": 19,
    "title": "AWS PrivateLink and VPC Endpoints for SaaS Integration",
    "scenario": "A company provides a Software-as-a-Service (SaaS) application hosted in their own AWS account. The application runs on EC2 instances behind a Network Load Balancer (NLB). They need to allow their customers to access this service from their own VPCs privately and securely, without the traffic ever traversing the public internet. The customers' VPCs may have overlapping CIDR blocks with the SaaS provider's VPC, and the solution must not require the SaaS provider to manage complex routing or firewall rules for each customer.",
    "questionText": "Which AWS service should the SaaS provider configure to enable this connectivity model?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Configure VPC Peering between the SaaS provider's VPC and each customer's VPC." },
      { "letter": "B", "text": "Set up an AWS Transit Gateway and have each customer create an attachment to it." },
      { "letter": "C", "text": "Create a VPC Endpoint Service (powered by AWS PrivateLink) and associate it with their Network Load Balancer. Provide the service name to customers." },
      { "letter": "D", "text": "Deploy a fleet of proxy EC2 instances with public IPs and instruct customers to route their traffic through these proxies." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: This is the primary use case for AWS PrivateLink. The SaaS provider creates a VPC Endpoint Service, which exposes their NLB as a service that other AWS accounts can connect to. Customers can then create an Interface VPC Endpoint in their own VPCs. This creates an Elastic Network Interface (ENI) with a private IP address from the customer's VPC that routes directly and privately to the provider's service. This model works with overlapping CIDRs, is highly secure as it doesn't open up broad network access, and scales easily without complex routing changes.",
    "wrongExplanation": "Why the others are wrong:\nA: VPC Peering requires non-overlapping CIDR blocks and creates a full network connection, which is often more permissive than desired. It also becomes very complex to manage at scale with many customers (a 'meshy' architecture).\nB: A Transit Gateway is used for interconnecting many VPCs and on-premises networks, typically within a single organization. It's not the standard model for secure, private SaaS provider-to-customer connectivity and would be overly complex and expensive.\nD: Using public proxies completely defeats the requirement for private connectivity and adds a security risk and a bottleneck."
  },
  {
    "number": 20,
    "title": "Configuring Amazon EBS for High-Performance Databases",
    "scenario": "A solutions architect is deploying a mission-critical PostgreSQL database on a large EC2 instance. The database requires sustained, low-latency disk performance of at least 15,000 IOPS for its primary data files and a separate, high-throughput volume for transaction logs. The chosen EC2 instance type supports EBS optimization and has sufficient bandwidth to the EBS service. The solution must provide the required performance consistently.",
    "questionText": "How should the EBS volumes be configured to meet these performance requirements?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Create a single General Purpose SSD (gp3) volume, provision it with 15,000 IOPS, and use it for both data and log files." },
      { "letter": "B", "text": "Create a Provisioned IOPS SSD (io2) volume with 15,000 IOPS for the data files and a separate Throughput Optimized HDD (st1) volume for the transaction logs." },
      { "letter": "C", "text": "Create a Provisioned IOPS SSD (io2 Block Express) volume with 15,000 IOPS for the data files and a separate General Purpose SSD (gp3) volume configured for high throughput for the transaction logs." },
      { "letter": "D", "text": "Stripe four General Purpose SSD (gp2) volumes together in a RAID 0 configuration to achieve the target IOPS." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: This configuration correctly matches the workload requirements to the strengths of different EBS volume types. For the database's primary data files, which require high, sustained, and low-latency IOPS, a Provisioned IOPS SSD (io2 Block Express) volume is the best choice, as it's designed for mission-critical, high-performance databases. For transaction logs, which are characterized by sequential, high-throughput writes, a General Purpose SSD (gp3) volume is an excellent and cost-effective choice. A gp3 volume's throughput can be provisioned independently of its size, making it flexible for this use case.",
    "wrongExplanation": "Why the others are wrong:\nA: While a gp3 volume is flexible, using a single volume for both data (random I/O) and logs (sequential I/O) can lead to I/O contention and inconsistent performance. Separating them is a database best practice.\nB: A Throughput Optimized HDD (st1) volume is designed for large, sequential workloads like data warehousing or log processing, but it is not suitable for the low-latency requirements of a database transaction log. HDD-based volumes have much higher latency than SSD volumes.\nD: While RAID 0 can be used to aggregate performance, it adds complexity and is an older pattern. A single io2 volume can deliver this level of performance without the overhead of managing a software RAID array. Furthermore, gp2 performance scales with size, making it less direct to configure, and its performance can burst and is less consistent than io2."
  },
  {
    "number": 21,
    "title": "Sizing Amazon EBS Volumes for Performance",
    "scenario": "An application running on an EC2 instance requires a storage volume that can consistently provide 4,000 IOPS. A cost-conscious engineer is deciding between a General Purpose SSD (gp2) volume and a General Purpose SSD (gp3) volume. The total storage capacity needed is only 200 GiB.",
    "questionText": "What is the most cost-effective and technically correct way to provision the volume to meet the 4,000 IOPS requirement?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Provision a 200 GiB gp2 volume. It will meet the IOPS requirement via its burst performance." },
      { "letter": "B", "text": "Provision a 1,334 GiB gp2 volume. This will provide a baseline performance of just over 4,000 IOPS." },
      { "letter": "C", "text": "Provision a 200 GiB gp3 volume and configure it with 4,000 IOPS and the baseline 125 MiB/s throughput." },
      { "letter": "D", "text": "Provision a 200 GiB Provisioned IOPS (io2) volume with 4,000 IOPS, as gp2/gp3 cannot guarantee this performance." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: The key difference between gp2 and gp3 is how performance is provisioned. For gp2, performance is tied to size (3 IOPS per GiB). For gp3, performance (IOPS and throughput) can be provisioned independently of size. To get a *sustained* 4,000 IOPS from gp2, you would need to provision a very large volume (4000/3 = 1333.3 GiB), which is not cost-effective. With gp3, you can provision the exact size you need (200 GiB) and independently provision the exact IOPS you need (4,000 IOPS). This makes gp3 the most cost-effective and direct solution for this requirement.",
    "wrongExplanation": "Why the others are wrong:\nA: A 200 GiB gp2 volume has a baseline performance of only 600 IOPS (200 * 3). While it can burst to 3,000 IOPS, this is temporary and cannot be relied upon for a *sustained* requirement of 4,000 IOPS. It doesn't even meet the requirement in burst.\nB: This is technically correct for gp2, but it's extremely wasteful and expensive. You would be paying for over 1.1 TiB of storage you don't need just to get the required IOPS.\nD: While an io2 volume could provide the performance, it is a higher-tier, more expensive volume type designed for more critical, lower-latency workloads. A gp3 volume can meet the specified 4,000 IOPS requirement more cost-effectively."
  },
  {
    "number": 22,
    "title": "Using Amazon EBS Snapshots for Cross-Region Disaster Recovery",
    "scenario": "A company runs its primary application infrastructure in the `us-west-2` region. A critical part of their disaster recovery (DR) plan is to be able to restore their application's EBS volumes in the `eu-west-1` region within a Recovery Time Objective (RTO) of 4 hours. They are currently taking nightly EBS snapshots in `us-west-2`. They need an automated, efficient method to make these snapshots available in the DR region.",
    "questionText": "What is the most effective and automated way to manage the cross-region availability of these EBS snapshots?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Write a Lambda function triggered by the snapshot completion event in `us-west-2`. The function should call the 'CopySnapshot' API to copy the snapshot to `eu-west-1`." },
      { "letter": "B", "text": "Create an Amazon Data Lifecycle Manager (DLM) policy in `us-west-2` that creates the snapshots and includes a cross-region copy action to replicate them to `eu-west-1`." },
      { "letter": "C", "text": "Manually copy the most recent snapshot to the `eu-west-1` region each morning using the AWS Management Console." },
      { "letter": "D", "text": "Enable S3 Cross-Region Replication on the S3 bucket where EBS snapshots are stored to automatically replicate them to a bucket in `eu-west-1`." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: Amazon Data Lifecycle Manager (DLM) is the native, managed service for automating the creation, retention, and deletion of EBS snapshots and AMIs. A key feature of DLM is the ability to define a cross-region copy action as part of the lifecycle policy. This allows you to fully automate the process of creating a snapshot in the source region and immediately copying it to one or more destination regions for DR purposes. This is the most efficient, scalable, and recommended approach.",
    "wrongExplanation": "Why the others are wrong:\nA: While this custom solution would work, it's undifferentiated heavy lifting. DLM provides this exact functionality out of the box without requiring you to write, manage, and monitor custom Lambda code.\nC: A manual process is not reliable, scalable, or compliant with a low RTO DR strategy. It is prone to human error and would not meet the automation requirement.\nD: This is based on a misunderstanding of how EBS snapshots are stored. While snapshots are stored in S3, they are in an AWS-managed S3 infrastructure that is not visible or accessible to you as a standard S3 bucket. You cannot apply S3 features like Cross-Region Replication to it. You must use the EBS APIs (or DLM) to manage snapshots."
  },
  {
    "number": 23,
    "title": "Creating Backup and Data Recovery Plans with AWS Backup",
    "scenario": "An enterprise has standardized on AWS Backup to protect its resources, which include Amazon RDS databases, DynamoDB tables, and EFS file systems across multiple accounts in an AWS Organization. They need to create a comprehensive disaster recovery plan. The plan must ensure that daily backups are taken, retained for 30 days, and copied to a secondary DR region (`eu-central-1`) with a 90-day retention period. They also need to be able to perform a test recovery once per quarter to validate the DR plan.",
    "questionText": "Which AWS Backup feature should be used to orchestrate these complex backup, replication, and testing requirements?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "A single backup plan with two backup rules: one for the daily local backup and one for the daily cross-region copy." },
      { "letter": "B", "text": "An AWS Backup vault in the primary region with a vault lock configured to enforce the 30-day retention." },
      { "letter": "C", "text": "An AWS Backup plan that defines the backup and retention schedule, combined with a cross-region copy action. Use AWS Backup Audit Manager to schedule and track recovery job tests." },
      { "letter": "D", "text": "An AWS Backup plan that defines the backup schedule and retention. Use Amazon Data Lifecycle Manager (DLM) to handle the cross-region copy." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: This solution correctly uses the features of AWS Backup for their intended purpose. An AWS Backup plan is the correct place to define the schedule (daily), the lifecycle (local retention of 30 days), and the cross-region copy action (copy to `eu-central-1` with 90-day retention). AWS Backup Audit Manager is the component specifically designed to help you prove compliance and test your data recovery. It allows you to create reports and, crucially, to track the status of your restore tests to ensure your DR plan is functional.",
    "wrongExplanation": "Why the others are wrong:\nA: A backup plan can have rules, and a rule can have a copy action. You would not typically create two separate rules for this; you'd have one rule that creates the backup and also copies it.\nB: A backup vault is where backups are stored, and vault lock is for WORM (Write Once, Read Many) compliance. While important, it doesn't define the backup schedule, the cross-region copy, or the testing strategy.\nD: DLM is for managing EBS snapshots and AMIs specifically. AWS Backup is the centralized service for managing backups across a wider range of services (RDS, DynamoDB, EFS, etc.). You would not mix the two services in this way; AWS Backup handles its own cross-region copies."
  },
  {
    "number": 24,
    "title": "Configuring Shared File System Storage for HPC",
    "scenario": "A research institute is setting up a High-Performance Computing (HPC) cluster on AWS using hundreds of EC2 instances. The cluster needs a shared, parallel file system that can provide extremely high levels of throughput (hundreds of GB/s) and millions of IOPS with sub-millisecond latencies. The data will be processed by Linux-based scientific applications. The file system should be accessible simultaneously from all compute nodes in the cluster.",
    "questionText": "Which combination of AWS storage services and configurations is the most appropriate for this use case? (Select TWO)",
    "isMultiChoice": true,
    "options": [
      { "letter": "A", "text": "Deploy an Amazon EFS file system in General Purpose mode and mount it on all EC2 instances." },
      { "letter": "B", "text": "Deploy an Amazon FSx for Lustre file system and link it to an S3 bucket for long-term data storage." },
      { "letter": "C", "text": "Deploy an Amazon FSx for Windows File Server Multi-AZ file system." },
      { "letter": "D", "text": "Choose the 'SCRATCH_2' deployment type for the FSx for Lustre file system to optimize for temporary, high-performance processing." },
      { "letter": "E", "text": "Create a large EBS io2 Block Express volume and attach it to all EC2 instances in multi-attach mode." }
    ],
    "correctAnswers": [ "B", "D" ],
    "explanation": "Why B and D are correct: Amazon FSx for Lustre is the purpose-built AWS service for high-performance, parallel file systems required by HPC workloads. Option B is correct because FSx for Lustre is designed to provide this massive throughput and IOPS. Linking it to an S3 bucket is a common and powerful pattern, allowing the file system to be hydrated with input data from S3 and to write results back to S3 for durable, long-term storage. Option D is also correct because for temporary, speed-optimized processing (typical of many HPC jobs), the 'SCRATCH' deployment type is ideal. It offers the highest performance by using SSD storage but does not persist data if the file system is stopped. This combination provides the extreme performance needed for the compute job itself.",
    "wrongExplanation": "Why the others are wrong:\nA: Amazon EFS is a scalable file system but it is not designed for the extreme, low-latency performance required by large-scale HPC clusters. FSx for Lustre is significantly more performant.\nC: FSx for Windows File Server is, as the name implies, for Windows-based workloads and uses the SMB protocol. The scenario specifies Linux-based applications.\nE: EBS Multi-Attach allows a single volume to be attached to a handful of instances (up to 16) within the same AZ. It cannot be attached to 'hundreds' of instances and is not a shared, parallel file system. It's designed for building cluster-aware applications, not general-purpose HPC file sharing."
  },
  {
    "number": 25,
    "title": "AWS Cost and Usage Awareness: Historical Analysis",
    "scenario": "A finance manager at a large company needs to perform a detailed, multi-dimensional analysis of the company's AWS costs over the past 12 months. They need to group costs by linked account, service, and custom cost allocation tags (e.g., 'Project' and 'CostCenter'). They also want to identify the primary driver of an unexpected cost increase in the Amazon EC2 service three months ago. The results of the analysis need to be easily visualized and shared with executives.",
    "questionText": "Which tool provides the most powerful and flexible capabilities for this type of detailed historical cost analysis?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "AWS Budgets reports, by setting up a budget for each linked account and tag." },
      { "letter": "B", "text": "The AWS Cost and Usage Report (CUR) delivered to an S3 bucket, queried with Amazon Athena, and visualized with Amazon QuickSight." },
      { "letter": "C", "text": "AWS Compute Optimizer, to identify over-provisioned resources that contributed to the cost increase." },
      { "letter": "D", "text": "The Bills page in the AWS Billing and Cost Management console." }
    ],
    "correctAnswers": [ "B" ],
    "explanation": "Why B is correct: The AWS Cost and Usage Report (CUR) is the most comprehensive source of cost and usage data available. It contains the most granular data, including resource IDs and cost allocation tags. By delivering this report to S3, you can use Amazon Athena to run powerful, ad-hoc SQL queries to slice and dice the data in any way required (e.g., group by tags, service, account). Amazon QuickSight can then connect directly to Athena as a data source to create rich, interactive dashboards and visualizations, which is perfect for identifying trends and sharing insights with executives. This combination provides the ultimate flexibility and power for deep-dive cost analysis.",
    "wrongExplanation": "Why the others are wrong:\nA: AWS Budgets is a tool for monitoring costs against a set threshold and forecasting. It is not designed for deep, retrospective analysis of historical data.\nC: AWS Compute Optimizer is focused on right-sizing recommendations. While it can help reduce future costs, it is not an analytical tool for exploring past spending drivers in detail.\nD: The Bills page provides a high-level summary of monthly charges. It lacks the granularity (e.g., resource-level data, hourly details) needed for the deep analysis described in the scenario."
  },
  {
    "number": 26,
    "title": "Using Control Mechanisms for AWS Cost Management",
    "scenario": "A university provides AWS accounts to its research departments. To prevent budget overruns, the central IT department wants to implement a control that automatically stops EC2 and RDS instances in a specific project's account if its forecasted monthly costs are projected to exceed a $5,000 threshold. The action must be taken automatically as soon as the forecast predicts the overrun, without waiting for the bill to be finalized.",
    "questionText": "Which combination of services should be used to implement this automated cost control mechanism?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "An AWS Config rule that triggers when costs exceed $5,000 and invokes an SSM Automation document to stop the resources." },
      { "letter": "B", "text": "An AWS Budget with a configured budget action. The budget should be set to a forecasted cost of $5,000 and the action should target an IAM role and an SCP to stop instances." },
      { "letter": "C", "text": "An AWS Budget with a configured budget action. The budget should be based on a forecasted cost of $5,000, and the action should be configured to execute an SSM Automation document that stops the EC2 and RDS instances." },
      { "letter": "D", "text": "A CloudWatch alarm based on the 'EstimatedCharges' metric that, when triggered, sends a message to an SQS queue, which is processed by a Lambda function to stop the resources." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: AWS Budgets Actions are the purpose-built feature for this exact scenario. You can create a budget that tracks either actual or forecasted costs. When the budget threshold is breached, it can trigger a defined action. The available actions include applying an IAM policy, attaching or detaching an SCP, or, as required here, targeting specific EC2 or RDS instances. The most flexible way to stop both EC2 and RDS instances is to have the budget action execute a Systems Manager (SSM) Automation document, which can be scripted to perform the necessary `StopInstances` and `StopDBInstance` API calls.",
    "wrongExplanation": "Why the others are wrong:\nA: AWS Config is a service for assessing resource configurations for compliance, not for monitoring costs. It does not track spending.\nB: An SCP (Service Control Policy) can deny permissions (e.g., deny `ec2:RunInstances`), but it cannot be used to actively stop already running resources. The action needs to be targeted at the resources themselves via an SSM document or similar execution.\nD: The CloudWatch 'EstimatedCharges' metric is updated periodically (every few hours) and reflects the total estimated charge for the entire account. It is not as timely or as granular as AWS Budgets, which is designed for this purpose. A budget based on a forecast is more proactive."
  },
  {
    "number": 27,
    "title": "AWS VPC Endpoints for Hybrid Services",
    "scenario": "A company has a service running on-premises that is connected to their AWS VPC via an AWS Direct Connect connection. A large number of AWS Lambda functions running in the VPC need to make frequent API calls to this on-premises service. The company wants to ensure that this communication is reliable and does not depend on an internet gateway or NAT gateway for connectivity. The on-premises service is fronted by a set of load balancers with static IP addresses.",
    "questionText": "What type of VPC endpoint should be used to allow the Lambda functions to privately access the on-premises service?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "An Interface VPC Endpoint for an AWS service like PrivateLink." },
      { "letter": "B", "text": "A Gateway VPC Endpoint for S3 and DynamoDB." },
      { "letter": "C", "text": "This is not possible; Lambda functions require a NAT Gateway to access on-premises resources." },
      { "letter": "D", "text": "An Interface VPC Endpoint associated with a VPC Endpoint Service, where the targets of the Endpoint Service are the IP addresses of the on-premises load balancers." }
    ],
    "correctAnswers": [ "D" ],
    "explanation": "Why D is correct: This scenario describes a less common but powerful use of AWS PrivateLink. You can create a Network Load Balancer (NLB) in your VPC and configure its target group with the private IP addresses of your on-premises resources (accessible via Direct Connect or VPN). Then, you can create a VPC Endpoint Service fronting this NLB. Finally, you create an Interface VPC Endpoint for that service within the same VPC (or another). This allows your Lambda functions to connect to the ENI of the interface endpoint, and the traffic is privately forwarded through the NLB to your on-premises service without any NAT or Internet Gateways.",
    "wrongExplanation": "Why the others are wrong:\nA: An Interface VPC Endpoint is part of the solution, but it must be connected to a VPC Endpoint Service. This option is incomplete.\nB: Gateway endpoints are only for S3 and DynamoDB and use a different technology (prefix lists in the route table). They cannot be used for custom services.\nC: This is incorrect. Lambda functions running in a VPC can access on-premises resources over a DX or VPN connection without a NAT Gateway if the routing and security groups are configured correctly. Using a VPC endpoint as described provides a more scalable and managed entry point."
  },
  {
    "number": 28,
    "title": "AWS Site-to-Site VPN High Availability and Performance",
    "scenario": "A company is establishing a connection between their on-premises data center and an AWS VPC using an AWS Site-to-Site VPN. The connection is critical for business operations and must be highly available, resilient to the failure of a single VPN tunnel, and provide a consistent throughput of 2 Gbps. The on-premises customer gateway device supports BGP and Equal-Cost Multi-Path (ECMP) routing.",
    "questionText": "How should the VPN connection be configured to meet these requirements?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Create a single Site-to-Site VPN connection with static routing. If one tunnel fails, manually update the route tables to use the second tunnel." },
      { "letter": "B", "text": "Create a Site-to-Site VPN connection configured with dynamic routing (BGP). This will provide automatic failover between the two tunnels of the VPN connection." },
      { "letter": "C", "text": "Create a Site-to-Site VPN connection over an AWS Direct Connect link to increase throughput." },
      { "letter": "D", "text": "Create a Site-to-Site VPN connection and attach it to an AWS Transit Gateway. Enable ECMP on the VPN connection to aggregate the throughput of both tunnels." }
    ],
    "correctAnswers": [ "D" ],
    "explanation": "Why D is correct: A standard Site-to-Site VPN connection to a VGW provides two tunnels for high availability, but traffic is only sent through one tunnel at a time (active/passive). To achieve higher throughput by using both tunnels simultaneously, you must use a Transit Gateway as the target. By attaching the VPN to a Transit Gateway and enabling the ECMP (Equal-Cost Multi-Path) option on the attachment, AWS will use both tunnels in an active/active configuration. This allows you to load-balance traffic across them, aggregating their bandwidth (1.25 Gbps per tunnel, so > 2 Gbps total) and providing seamless failover.",
    "wrongExplanation": "Why the others are wrong:\nA: Static routing does not provide automatic failover and is not a highly available solution.\nB: A standard VPN connection with BGP provides automatic failover, but it operates in an active/passive mode. It will not aggregate the throughput of the two tunnels to exceed the 1.25 Gbps limit of a single tunnel.\nC: You can run a VPN over a Direct Connect link (for encryption), but this doesn't inherently solve the throughput aggregation problem. The core mechanism to use both tunnels in active/active is ECMP with a Transit Gateway."
  },
  {
    "number": 29,
    "title": "AWS Direct Connect High Availability Models",
    "scenario": "A financial services firm requires a highly available and redundant network connection from their on-premises data center to their AWS VPCs in the `us-east-1` region. Their internal policy mandates resilience against the failure of a single device, a single AWS Direct Connect location, and even the failure of a single AWS Availability Zone. The connection must provide consistent, low-latency performance.",
    "questionText": "Which Direct Connect configuration should be implemented to meet these stringent requirements?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "A single Direct Connect connection to one AWS DX location, with two virtual interfaces (VIFs) terminating on a Direct Connect gateway." },
      { "letter": "B", "text": "Two Direct Connect connections terminating in the same AWS DX location, connecting to a Direct Connect gateway." },
      { "letter": "C", "text": "Two Direct Connect connections, each terminating in a different AWS DX location within the `us-east-1` region. Both connections are associated with a single Direct Connect gateway." },
      { "letter": "D", "text": "One Direct Connect connection and a Site-to-Site VPN connection as a backup, both terminating on a Direct Connect gateway." }
    ],
    "correctAnswers": [ "C" ],
    "explanation": "Why C is correct: This configuration describes the 'Maximum Resiliency' model for Direct Connect. By having two connections to two separate DX locations, you are resilient against the failure of an entire location (e.g., due to a power outage or fiber cut affecting that building). Associating both with a Direct Connect gateway allows both connections to access VPCs in any AZ within the region, and the use of BGP over these connections provides automatic failover. This model protects against device failure, location failure, and provides AZ-level resilience, meeting all the requirements.",
    "wrongExplanation": "Why the others are wrong:\nA: This only protects against the failure of a single virtual interface, not a device failure or a location failure.\nB: This model provides device redundancy but does not protect against the failure of the entire DX location. Both connections share the same fate if the location goes down.\nD: This is a valid high-availability pattern, but it does not provide the same consistent, low-latency performance as a second Direct Connect link. A VPN backup is typically lower bandwidth and higher latency. The requirement was for consistent performance, making two DX links the superior choice."
  },
  {
    "number": 30,
    "title": "AWS Budgets Advanced Filtering",
    "scenario": "A company uses a detailed tagging strategy to track costs. They have a project, 'Phoenix', that uses multiple AWS services including EC2, S3, and RDS. All resources for this project are tagged with a `Project:Phoenix` tag. The project manager needs to be alerted when the total cost of the Phoenix project, *excluding* any S3 data transfer costs, is forecasted to exceed $10,000 for the month.",
    "questionText": "How can an AWS Budget be configured to meet this specific requirement?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "Create one budget filtered by the 'Project:Phoenix' tag and a second budget filtered by the 'Service:S3' tag and the 'Usage Type Group:Data Transfer' filter. Manually subtract the second from the first." },
      { "letter": "B", "text": "Create a single budget with a filter for the 'Project:Phoenix' tag. It's not possible to exclude specific costs within a single budget." },
      { "letter": "C", "text": "Create a cost category to group all 'Project:Phoenix' costs, then create a budget that filters by this cost category." },
      { "letter": "D", "text": "Create a single budget. In the filtering options, add a 'Tag' filter for 'Project:Phoenix'. Then, add a 'Usage Type Group' filter, select 'Data Transfer - S3', and enable the 'Exclude' option for this filter." }
    ],
    "correctAnswers": [ "D" ],
    "explanation": "Why D is correct: AWS Budgets supports advanced filtering, including the ability to both include and exclude specific dimensions. The correct approach is to create one budget and apply multiple filters. The first filter will be an 'include' filter for the tag `Project:Phoenix`. The second filter will be an 'exclude' filter applied to the 'Usage Type Group' dimension, specifically for the S3 data transfer groups. This combination precisely targets the desired cost pool, providing a single, accurate budget and alert.",
    "wrongExplanation": "Why the others are wrong:\nA: This is a manual, cumbersome process that doesn't provide a single, automated alert based on the combined logic.\nB: This is incorrect. AWS Budgets has supported advanced filtering and exclusion for some time.\nC: A cost category is a useful tool for grouping costs, but it doesn't solve the problem of *excluding* a sub-component of the cost within that group. The filtering must be done in the budget itself."
  },
  {
    "number": 31,
    "title": "AWS Compute Optimizer for EC2 and Auto Scaling",
    "scenario": "An organization is running a web application on an Auto Scaling group (ASG) that is configured to use `m5.2xlarge` instances. The application experiences variable load, and the operations team suspects the instances might be over-provisioned during non-peak hours. They want to use AWS Compute Optimizer to get right-sizing recommendations. However, when they check Compute Optimizer, the ASG is not showing up in the dashboard, and no recommendations are available for it, even though it has been running for over a month.",
    "questionText": "What is the most likely reason that AWS Compute Optimizer is not providing recommendations for this Auto Scaling group?",
    "isMultiChoice": false,
    "options": [
      { "letter": "A", "text": "The Auto Scaling group is configured with a step scaling policy instead of a target tracking policy." },
      { "letter": "B", "text": "The EC2 instances in the ASG do not have the CloudWatch agent installed and configured to collect memory utilization metrics." },
      { "letter": "C", "text": "AWS Compute Optimizer was not opted-in at the AWS Organization level from the management account." },
      { "letter": "D", "text": "The Auto Scaling group is configured with a launch configuration instead of a launch template." }
    ],
    "correctAnswers": [ "D" ],
    "explanation": "Why D is correct: AWS Compute Optimizer has a specific prerequisite for analyzing Auto Scaling groups: the ASG must be configured to use a launch template. It does not support ASGs that still use the older launch configurations. This is a common 'gotcha' for teams trying to adopt Compute Optimizer for their ASGs. To get recommendations, the team must migrate their ASG from its launch configuration to a new launch template.",
    "wrongExplanation": "Why the others are wrong:\nA: The type of scaling policy used does not affect whether Compute Optimizer can analyze the ASG.\nB: While memory metrics from the CloudWatch agent provide *better* and more comprehensive recommendations (e.g., for memory-optimized instance types), their absence does not prevent Compute Optimizer from providing recommendations altogether. It will still provide recommendations based on CPU, disk, and network I/O, but they will be marked as missing memory data.\nC: Compute Optimizer is an opt-in service, but it can be opted-in at the individual account level. Organizational opt-in is not a strict requirement for a single account to see its own resources."
  }
]
