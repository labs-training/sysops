const main_title = "AWS SysOps Practice Quiz";
 // --- DATA SOURCE ---
const questions =
[
  {
    "number": 1,
    "title": "AWS Fleet Manager Secure Access",
    "scenario": "An organization manages a large fleet of Windows Server EC2 instances running in private subnets with no direct internet access. Administrators need secure Remote Desktop Protocol (RDP) access to these instances for troubleshooting and maintenance. Corporate security policy strictly forbids opening inbound RDP port 3389 in any security group, even temporarily. The solution must use AWS native services, integrate with IAM for access control, and avoid installing third-party remote access software.",
    "questionText": "What is the most secure and efficient method to provide administrators with RDP access under these constraints?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Deploy an EC2 bastion host in a public subnet and configure its security group to allow RDP access from the administrators' IPs. Then, use the bastion to connect to the private instances."
      },
      {
        "letter": "B",
        "text": "Use AWS Systems Manager Fleet Manager's remote desktop feature. Ensure instances have the SSM Agent and an IAM instance profile with Systems Manager permissions, then connect via the AWS Management Console."
      },
      {
        "letter": "C",
        "text": "Use AWS Systems Manager Run Command to execute a PowerShell script that creates a temporary user account and adds a security group rule allowing RDP access for a limited time."
      },
      {
        "letter": "D",
        "text": "Configure an AWS Client VPN endpoint to provide administrators with access to the private subnets, then use a standard RDP client to connect to the instances' private IP addresses."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: AWS Systems Manager Fleet Manager is designed for this exact use case. It leverages the SSM Agent to create a secure WebSocket stream tunnel for the RDP connection, proxied through the Systems Manager service. This method does not require any inbound ports to be opened on the instance's security group, thus adhering to the strict security policy. Access is controlled via IAM policies, providing granular, auditable control over who can connect. This is the most secure, efficient, and AWS-native solution.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This solution requires opening port 3389 on the bastion host, and potentially from the bastion to the private instances, which adds risk and operational overhead. \n**C**: This directly violates the security policy that forbids opening the RDP port, even temporarily. It is an insecure and complex workaround. \n**D**: While a Client VPN provides secure network access to the VPC, it does not solve the RDP access problem by itself. You would still need to open port 3389 on the instances' security groups to allow the RDP traffic, which is forbidden by the policy."
  },
  {
    "number": 2,
    "title": "Elastic Load Balancing for Static IP and L7 Routing",
    "scenario": "A company hosts multiple distinct services on a single fleet of EC2 instances. They use an Application Load Balancer (ALB) with host-based routing rules (e.g., api.example.com, app.example.com) to direct traffic to the correct service. A key business partner needs to whitelist a single, stable, static IP address to send traffic to the services. An ALB does not provide a static IP address.",
    "questionText": "How can the company meet the requirement for a static IP address while retaining the host-based routing functionality of the ALB? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "Replace the Application Load Balancer with a Network Load Balancer, as it supports static IPs."
      },
      {
        "letter": "B",
        "text": "Place a Network Load Balancer (NLB) in front of the Application Load Balancer."
      },
      {
        "letter": "C",
        "text": "Use AWS Global Accelerator and register the Application Load Balancer as an endpoint."
      },
      {
        "letter": "D",
        "text": "Request a static IP address for the Application Load Balancer via a support ticket."
      },
      {
        "letter": "E",
        "text": "Assign an Elastic IP address to the NLB created in front of the ALB."
      }
    ],
    "correctAnswers": ["B", "E"],
    "explanation": "Why B and E are correct: \nThis scenario requires a combination of features from different load balancers. **B** is correct because the standard architecture to solve this problem is to chain load balancers. A Network Load Balancer is placed in front of the Application Load Balancer. The NLB provides a static IP and passes the traffic through to the ALB. The ALB then performs the required Layer 7 host-based routing. **E** is correct because a Network Load Balancer can be assigned a static **Elastic IP address** per Availability Zone. This provides the stable IP address that the partner can whitelist. The combination of NLB with an Elastic IP (for a static entry point) and an ALB (for L7 routing) meets all requirements. While AWS Global Accelerator is also a valid solution, the combination of B and E describes a complete and common architectural pattern.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Replacing the ALB with an NLB would solve the static IP requirement but remove the critical Layer 7 host-based routing functionality, as an NLB operates at Layer 4. \n**C**: While AWS Global Accelerator can provide static IPs for an ALB, the question is asking for a combination of two correct options describing a single solution. The NLB + EIP is a more direct and common pattern for this specific load balancer problem, and this option represents an alternative solution, not a complementary part of the NLB solution. \n**D**: Application Load Balancers are designed to be highly scalable and do not support being assigned a single static IP address. This is a fundamental design characteristic, and it cannot be changed."
  },
  {
    "number": 3,
    "title": "Amazon Route 53 Resolver for Hybrid DNS",
    "scenario": "A company has a hybrid setup with an on-premises data center connected to an AWS VPC via Direct Connect. The on-premises network uses DNS servers to resolve internal hostnames like `server.corp.local`. Applications in the VPC need to resolve these hostnames. Conversely, on-premises servers need to resolve AWS resource names like `db.prod.aws` in a private hosted zone associated with the VPC. The on-premises DNS servers do not support granular conditional forwarding.",
    "questionText": "What is the most effective AWS-native solution to enable this bidirectional DNS resolution?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create a public hosted zone in Route 53 for `corp.local` and replicate all on-premises DNS records."
      },
      {
        "letter": "B",
        "text": "Deploy and manage a fleet of EC2 instances running BIND to act as DNS forwarders in the VPC."
      },
      {
        "letter": "C",
        "text": "Configure Route 53 Resolver with an outbound endpoint and a forwarding rule for `corp.local` to on-premises DNS servers, and an inbound endpoint that on-premises servers can forward `prod.aws` queries to."
      },
      {
        "letter": "D",
        "text": "Update the VPC's DHCP options set to use the IP addresses of the on-premises DNS servers as the primary nameservers."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: This is the canonical use case for Amazon Route 53 Resolver. The solution is composed of two parts for bidirectional resolution: 1) An **outbound endpoint** combined with a forwarding rule tells the VPC's internal resolver (`.2` address) where to send queries for a specific domain (`corp.local`). The queries are forwarded to the on-premises DNS servers. 2) An **inbound endpoint** creates network interfaces within the VPC that have IP addresses. The on-premises DNS servers are then configured to forward queries for the AWS domain (`prod.aws`) to these IPs. This architecture is managed, highly available, and the intended AWS-native solution.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Using a public hosted zone is incorrect for private hostnames and creates security risks. Replicating records is also a brittle, manual process. \n**B**: This is a self-managed solution that introduces significant operational overhead for patching, scaling, and maintaining the BIND servers. Route 53 Resolver is the managed equivalent. \n**D**: This would force all DNS queries from the VPC to go on-premises first. This would break the resolution of public AWS service endpoints and resources in the `prod.aws` private hosted zone, as the on-premises servers have no knowledge of them."
  },
  {
    "number": 4,
    "title": "Scaling with AWS Auto Scaling",
    "scenario": "A company runs a web application on a fleet of EC2 instances managed by an Auto Scaling group (ASG). The application experiences a massive, predictable surge in traffic every weekday morning at 9:00 AM. The current target tracking scaling policy, based on CPU utilization, is too slow to react, resulting in poor user experience for the first 15 minutes of the business day. The company needs to ensure sufficient capacity is available *before* the morning surge begins.",
    "questionText": "What is the most appropriate scaling strategy to address this issue?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Implement a step scaling policy with a lower CPU threshold and a shorter cooldown period."
      },
      {
        "letter": "B",
        "text": "Create a scheduled scaling action that sets the ASG's desired capacity to a higher value at 8:45 AM every weekday."
      },
      {
        "letter": "C",
        "text": "Write a Lambda function, triggered by a cron expression, to manually add instances to the ASG before the surge."
      },
      {
        "letter": "D",
        "text": "Increase the `HealthCheckGracePeriod` for the ASG to allow instances to boot faster."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: The key requirement is to scale proactively based on a predictable, time-based pattern. **Scheduled scaling** is the AWS Auto Scaling feature designed for exactly this purpose. You can create a scheduled action that changes the `Desired`, `Min`, and `Max` sizes of your Auto Scaling group at a specific time and on a recurring basis (e.g., every weekday). Setting the desired capacity higher just before 9:00 AM ensures the necessary instances are running and ready to handle the traffic surge proactively, rather than reacting to it.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Step scaling, like target tracking, is still a *reactive* policy. It responds to changes in metrics like CPU utilization, which means it will only scale up *after* the surge has already begun and CPU is high. \n**C**: While this would work, it is an over-engineered solution. Scheduled scaling is a native feature of Auto Scaling groups and does not require writing or maintaining custom Lambda functions. \n**D**: The `HealthCheckGracePeriod` is the time Auto Scaling waits before marking a newly launched instance as unhealthy. It does not affect how quickly the group scales out."
  },
  {
    "number": 5,
    "title": "Scaling with Spot Instances",
    "scenario": "A research institution runs large-scale, fault-tolerant data analysis jobs on AWS. These jobs can be divided into many small, independent tasks and can be safely stopped and restarted. To minimize costs, they want to use Spot Instances exclusively. Their main goal is to acquire a large amount of compute capacity while minimizing the chance of interruptions from Spot Instance reclamations.",
    "questionText": "Which strategy should they use when requesting Spot Instances to achieve this goal?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Use an EC2 Auto Scaling group configured to request a single, large instance type in a single Availability Zone to simplify management."
      },
      {
        "letter": "B",
        "text": "Set the maximum Spot price significantly higher than the current Spot price to guarantee that their instances will not be interrupted."
      },
      {
        "letter": "C",
        "text": "Use an EC2 Fleet or Auto Scaling group with a flexible configuration that specifies a wide variety of instance types, sizes, and families across multiple Availability Zones, and use the `capacity-optimized` allocation strategy."
      },
      {
        "letter": "D",
        "text": "Use an EC2 Fleet with the `lowest-price` allocation strategy to ensure the absolute minimum cost at all times."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: The key to using Spot successfully is **flexibility**. By specifying a diverse range of instance types (e.g., m5.large, c5.large, r5.large) and sizes across multiple Availability Zones, you give EC2 many different Spot capacity pools to draw from. The **`capacity-optimized`** allocation strategy is designed to automatically launch instances from the Spot capacity pools with the most available capacity, which directly translates to the lowest likelihood of interruption. This combination maximizes both the availability of capacity and the stability of the Spot fleet.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Relying on a single instance type in a single AZ is the worst strategy for Spot. If that specific Spot pool runs out of capacity, your entire workload will be interrupted. \n**B**: Setting a high maximum price does not prevent interruptions. Spot interruptions are based on capacity demand, not just price. If AWS needs the capacity back, your instance will be reclaimed regardless of your bid price. \n**D**: The `lowest-price` allocation strategy will always choose the cheapest pool, but these pools are often the most popular and therefore have the highest risk of interruption. For workloads that need to run with minimal interruption, `capacity-optimized` is the recommended strategy."
  },
  {
    "number": 6,
    "title": "VPC Flow Logs for Security Forensics",
    "scenario": "Following a security incident, a forensics team needs to analyze network traffic patterns within a production VPC over the last 30 days. Specifically, they need to identify all IP addresses outside of the VPC that attempted to connect to any EC2 instance on TCP port 22 (SSH) and were rejected by a security group. The VPC Flow Logs are being delivered to an Amazon S3 bucket.",
    "questionText": "What is the most efficient method to query the logs and get this specific information?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Download the compressed VPC Flow Log files from S3 to a local machine, decompress them, and use command-line tools like `grep` to search for entries containing `REJECT` and port 22."
      },
      {
        "letter": "B",
        "text": "Create an Amazon Athena table based on the VPC Flow Logs in S3. Run a SQL query that filters for `action = 'REJECT'`, `dstport = 22`, and where `srcaddr` is not within the VPC's CIDR range."
      },
      {
        "letter": "C",
        "text": "Enable GuardDuty and wait for it to generate a finding related to SSH brute-force attacks, then analyze the finding details."
      },
      {
        "letter": "D",
        "text": "Stream the VPC Flow Logs to Amazon CloudWatch Logs. Use a CloudWatch Logs Insights query with a filter expression to find the rejected SSH traffic."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **Amazon Athena** is the perfect tool for this use case. It allows you to run complex SQL queries directly on large datasets stored in S3, like VPC Flow Logs. By creating a table that defines the structure of the flow logs, you can write a simple SQL query to perform a powerful, server-side search. The query can efficiently filter billions of log entries for the exact conditions required (`action = 'REJECT'`, `dstport = 22`, and source IP outside the VPC), making it the most efficient method for historical analysis of large volumes of log data.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This is extremely inefficient and not scalable. Downloading potentially terabytes of log data is slow, and client-side processing with `grep` is much less powerful than a structured SQL query. \n**C**: GuardDuty is a threat detection service, not a historical log query tool. It may not have generated a specific finding for every rejected connection, and it cannot be used to arbitrarily query past network flows. \n**D**: While CloudWatch Logs Insights is powerful for real-time and recent log analysis, the scenario specifies analyzing 30 days of historical data already stored in S3. Setting up a new stream would not help analyze existing logs, and for large historical datasets, Athena is generally more cost-effective and performant."
  },
  {
    "number": 7,
    "title": "Managing Licenses with AWS License Manager",
    "scenario": "A company is migrating a large number of on-premises servers to AWS. Many of these servers use expensive, per-CPU core software licenses (e.g., Microsoft SQL Server Enterprise). The company wants to ensure they remain compliant with their licensing agreements and avoid over-provisioning licenses. They need a way to enforce that EC2 instances requiring these licenses are only launched on EC2 Dedicated Hosts with a specific number of physical cores, and to track license usage against their purchased limit.",
    "questionText": "What is the most effective way to enforce these licensing rules using AWS services?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Use AWS Budgets to track the cost of instances with specific tags and send an alert if the cost exceeds the license value."
      },
      {
        "letter": "B",
        "text": "Create a license configuration in AWS License Manager based on the number of physical cores. Create a host resource group of Dedicated Hosts, and associate the license configuration with an AMI that has the software installed."
      },
      {
        "letter": "C",
        "text": "Write a Service Control Policy (SCP) that uses IAM condition keys to deny the `ec2:RunInstances` call if the instance type has more cores than the license allows."
      },
      {
        "letter": "D",
        "text": "Use AWS Config to create a custom rule that checks the vCPU count of running instances and marks them as non-compliant if they exceed the licensed amount."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **AWS License Manager** is the purpose-built service for this scenario. The correct approach is to create a **license configuration** that defines the rules of your agreement (e.g., based on vCPUs, physical cores, sockets). For core-based licenses that require dedicated hardware, you associate this configuration with an AMI. License Manager then integrates with EC2 placement rules. By launching the AMI onto a **Dedicated Host** that is part of a host resource group, License Manager tracks the usage of physical cores against your defined license count and will prevent the launch of new instances on that host if it would violate the license limit. This provides a robust, preventative compliance control.",
    "wrongExplanation": "Why the others are wrong: \n**A**: AWS Budgets track cost, not license compliance. It is a detective control for spending, not a preventative control for license usage. \n**C**: While an SCP could potentially block instance types, it's a blunt instrument. It doesn't provide the sophisticated tracking, reporting, and integration with AMIs and Dedicated Hosts that License Manager does. \n**D**: AWS Config is a detective control. It can tell you *after* a non-compliant instance has been launched, but it cannot prevent it from launching in the first place, which is a key requirement for avoiding license violations."
  },
  {
    "number": 8,
    "title": "Monitoring and Maintaining Healthy Workloads",
    "scenario": "An Auto Scaling group (ASG) manages a fleet of EC2 instances behind an Application Load Balancer (ALB). The ASG is configured to use ELB health checks. An administrator notices that when they deploy a new version of the application, instances running the old version are terminated immediately by the ASG, even if they are still processing long-running user requests. They need a way to ensure that instances are drained of existing connections before they are terminated during a scale-in event or deployment.",
    "questionText": "What should the administrator configure to ensure graceful termination of instances?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Increase the Health Check Interval on the ALB health check."
      },
      {
        "letter": "B",
        "text": "Configure a Lifecycle Hook for the `EC2_INSTANCE_TERMINATING` state in the Auto Scaling group and enable connection draining on the ALB's target group."
      },
      {
        "letter": "C",
        "text": "Increase the Unhealthy Threshold on the ELB health check to a high value."
      },
      {
        "letter": "D",
        "text": "Configure the ASG to use EC2 status checks instead of ELB health checks."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This is a classic operational excellence pattern. Two features work together here. First, **connection draining** (also known as deregistration delay) on the ALB's target group tells the load balancer to stop sending *new* requests to an instance that is being deregistered, while allowing existing requests to complete, up to a configured timeout. Second, an Auto Scaling **Lifecycle Hook** for the `EC2_INSTANCE_TERMINATING` transition pauses the termination process. This gives the connection draining process time to complete gracefully before the ASG proceeds with actually terminating the instance. This combination ensures no user requests are abruptly cut off.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Changing the health check interval only affects how frequently the ALB checks the instance's health; it does not help with connection draining. \n**C**: Increasing the unhealthy threshold would just make the instance appear healthy to the ALB for longer, delaying termination but not ensuring a graceful shutdown of existing connections. \n**D**: EC2 status checks only verify the underlying hypervisor and instance health. They have no knowledge of the application's state or active connections. ELB health checks are required for application-level health monitoring."
  },
  {
    "number": 9,
    "title": "Monitoring AWS Infrastructure",
    "scenario": "An operations team needs a comprehensive view of the health and performance of their core AWS infrastructure, which includes EC2 instances, EBS volumes, and an Application Load Balancer (ALB). They want to create a single, high-level dashboard that shows key performance indicators (KPIs) like average CPU Utilization for the EC2 fleet, the Disk I/O for critical EBS volumes, and the number of `HTTPCode_Target_5XX_Count` errors from the ALB. They also need to be alerted if any of these metrics breach predefined thresholds.",
    "questionText": "Which two AWS services should be primarily used to create this monitoring and alerting solution? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "AWS CloudTrail"
      },
      {
        "letter": "B",
        "text": "Amazon CloudWatch Dashboards"
      },
      {
        "letter": "C",
        "text": "AWS X-Ray"
      },
      {
        "letter": "D",
        "text": "Amazon CloudWatch Alarms"
      },
      {
        "letter": "E",
        "text": "VPC Flow Logs"
      }
    ],
    "correctAnswers": ["B", "D"],
    "explanation": "Why B and D are correct: \nThis is the core functionality of Amazon CloudWatch. **B** is correct because **CloudWatch Dashboards** are the native tool for creating customizable views of metrics from various AWS services. You can create widgets for EC2 CPU, EBS I/O, ALB error counts, and more, arranging them into a single pane of glass for easy visualization of infrastructure health. **D** is correct because **CloudWatch Alarms** are used to watch a single metric over a specified time period and perform one or more actions (like sending a notification to an SNS topic) based on the value of the metric relative to a given threshold. This is the standard way to set up automated alerting for the specified KPIs.",
    "wrongExplanation": "Why the others are wrong: \n**A**: AWS CloudTrail is a service that records API activity in your account for auditing and governance. It does not track performance metrics like CPU utilization. \n**C**: AWS X-Ray is an application performance management (APM) service used for tracing requests through a distributed application. It is not used for monitoring raw infrastructure metrics like disk I/O. \n**E**: VPC Flow Logs capture information about IP traffic going to and from network interfaces in your VPC. They do not contain infrastructure performance metrics."
  },
  {
    "number": 10,
    "title": "Monitoring AWS Applications",
    "scenario": "A developer team runs a critical web application on EC2 instances. They need to collect detailed application-level logs (e.g., stack traces from exceptions, user activity logs) and custom application metrics (e.g., number of user sign-ups per minute). The solution must allow them to search the logs in near real-time and create dashboards and alarms based on the custom metrics. The instances are already running the SSM Agent.",
    "questionText": "What is the most effective approach to collect both logs and custom metrics from the application?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Configure the application to write logs and metrics to local files, then use AWS Backup to back up these files to S3 for analysis."
      },
      {
        "letter": "B",
        "text": "Install and configure the unified Amazon CloudWatch Agent on the EC2 instances. Configure the agent to stream the application log files to CloudWatch Logs and to collect the custom metrics for submission to CloudWatch Metrics."
      },
      {
        "letter": "C",
        "text": "Use AWS Systems Manager Run Command to periodically run a script that collects metrics and `cat`s the log files, returning the output to the console."
      },
      {
        "letter": "D",
        "text": "Enable VPC Flow Logs with a custom format to capture application-layer data and send it to S3 for analysis with Athena."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: The **unified Amazon CloudWatch Agent** is the purpose-built tool for this requirement. It is a single agent that can be configured to perform multiple tasks. You can configure it to monitor specific log files on the instance and stream them to **CloudWatch Logs** for searching and analysis. Simultaneously, you can configure it to collect custom metrics (e.g., via the `statsd` or `collectd` protocols, or by scraping a metrics endpoint) and publish them as custom metrics to **CloudWatch Metrics**. This allows you to create dashboards and alarms based on your application-specific data. This unified approach is the most efficient and feature-rich AWS-native solution.",
    "wrongExplanation": "Why the others are wrong: \n**A**: AWS Backup is for data protection and recovery, not for real-time log analysis or metrics collection. \n**C**: This is an inefficient, polling-based mechanism that would miss data between executions and is not a scalable solution for real-time monitoring. \n**D**: VPC Flow Logs operate at the network layer (Layer 3/4) and cannot capture application-level log data or custom metrics from within the instance's operating system."
  },
  {
    "number": 11,
    "title": "AWS X-Ray for Performance Analysis",
    "scenario": "A microservices application consists of an API Gateway that invokes a primary AWS Lambda function, which in turn calls two other downstream Lambda functions and writes data to a DynamoDB table. Users are reporting intermittent high latency. A developer needs to trace a single user's request through the entire chain of services to identify which specific segment is the primary contributor to the latency. They also want a visual service map of the application's components.",
    "questionText": "Which two actions are required to collect the necessary data and visualize the request flow? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "Enable active tracing on the API Gateway stage."
      },
      {
        "letter": "B",
        "text": "Enable Amazon GuardDuty to analyze the Lambda execution logs for performance anomalies."
      },
      {
        "letter": "C",
        "text": "In each Lambda function's configuration, enable active tracing."
      },
      {
        "letter": "D",
        "text": "Enable VPC Flow Logs for the Lambda functions' VPC to trace network paths."
      },
      {
        "letter": "E",
        "text": "In the IAM execution role for each Lambda function, add the `AWSXRayDaemonWriteAccess` policy."
      }
    ],
    "correctAnswers": ["A", "C"],
    "explanation": "Why A and C are correct: \nTo get a complete end-to-end trace with AWS X-Ray for a serverless application, you need to enable tracing at each stage of the request. **A** is correct because enabling **active tracing** on the API Gateway stage is the first step. This tells API Gateway to sample incoming requests and propagate a trace header to the downstream Lambda function. **C** is correct because you must also enable active tracing in the configuration for each subsequent AWS Lambda function. When enabled, the Lambda service automatically runs the X-Ray daemon and captures metadata about the function's execution (like startup time and duration) and any downstream calls made using an X-Ray-instrumented AWS SDK. These two steps ensure that X-Ray can stitch together the segments from API Gateway and all Lambda functions into a single, complete trace.",
    "wrongExplanation": "Why the others are wrong: \n**B**: GuardDuty is a threat detection service, not an application performance monitoring tool. \n**D**: VPC Flow Logs capture network-level metadata but do not provide application-level trace data that links requests across services. \n**E**: While the Lambda function's execution role does need permissions to send trace data to X-Ray, enabling active tracing in the Lambda configuration automatically adds the required permissions (`xray:PutTraceSegments` and `xray:PutTelemetryRecords`) to the role. Manually adding the `AWSXRayDaemonWriteAccess` policy is not required when using this feature."
  },
  {
    "number": 12,
    "title": "Amazon EventBridge Advanced Routing",
    "scenario": "An e-commerce platform generates events from two different microservices: an 'orders' service and a 'payments' service. Both services publish their events to a central Amazon EventBridge event bus. The platform has two requirements: 1) All events from the 'orders' service that have a `status` field of `\"shipped\"` must be sent to an SQS queue for the shipping department. 2) All events from the 'payments' service that have a `result` field of `\"failed\"` must trigger an AWS Lambda function to alert the finance team.",
    "questionText": "How should EventBridge be configured to correctly route these events?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create a single EventBridge rule with two targets: the SQS queue and the Lambda function. Use an Input Transformer to filter the events before sending them to the targets."
      },
      {
        "letter": "B",
        "text": "Create two separate EventBridge rules. One rule will have an event pattern that filters for the 'shipped' order events and targets the SQS queue. The second rule will have an event pattern that filters for the 'failed' payment events and targets the Lambda function."
      },
      {
        "letter": "C",
        "text": "Configure the 'orders' and 'payments' microservices to send events directly to the SQS queue and Lambda function, respectively."
      },
      {
        "letter": "D",
        "text": "Create a single EventBridge rule that matches all events from both sources and sends them to a Kinesis Data Stream for later processing and filtering by a consumer application."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This solution requires content-based filtering and routing, which is the core strength of EventBridge. The correct approach is to create separate, independent rules for each distinct routing requirement. The first rule will have a precise **event pattern** (e.g., `{\"source\": [\"orders.service\"], \"detail\": {\"status\": [\"shipped\"]}}`) that matches only the desired order events and routes them to the SQS queue. The second rule will have a different event pattern (e.g., `{\"source\": [\"payments.service\"], \"detail\": {\"result\": [\"failed\"]}}`) that matches only the failed payment events and routes them to the Lambda function. This decoupled, rule-based approach is the intended design pattern for EventBridge.",
    "wrongExplanation": "Why the others are wrong: \n**A**: A single rule cannot have conditional targets. A rule's event pattern is evaluated once, and if it matches, the event is sent to *all* of its targets. An Input Transformer can change the shape of an event, but it cannot be used for conditional routing logic. \n**C**: This bypasses the event bus entirely, creating a tightly coupled system and losing all the benefits of event-driven architecture like decoupling, observability, and routing flexibility. \n**D**: This simply forwards all events to another service for filtering, which is inefficient. The filtering should be done within EventBridge itself using rules for maximum efficiency and simplicity."
  },
  {
    "number": 13,
    "title": "AWS IAM Access Analyzer for External Access",
    "scenario": "A security team at a large corporation is responsible for auditing all S3 buckets to ensure no data is inadvertently exposed to external entities. They have hundreds of AWS accounts under an AWS Organization. The team needs to find all S3 buckets that have policies allowing access to an AWS account outside of their organization, but they want to ignore access from trusted third-party accounts that are defined in an approved list. The solution must be automated and continuous.",
    "questionText": "What is the most effective and direct way to achieve this continuous auditing goal?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Write a custom AWS Lambda function that uses the S3 API to periodically scan all bucket policies in every account, compares the principal against a list of trusted accounts, and sends a report to the security team."
      },
      {
        "letter": "B",
        "text": "Enable AWS Config with the `s3-bucket-public-read-prohibited` managed rule across all accounts to detect publicly accessible buckets."
      },
      {
        "letter": "C",
        "text": "In the organization's management account, create an AWS IAM Access Analyzer with the organization as the zone of trust. Configure archive rules to automatically suppress findings that grant access to the principal of a trusted third-party account."
      },
      {
        "letter": "D",
        "text": "Deploy an AWS CloudTrail trail in each account to log all S3 API activity. Use Amazon Athena to query the logs for `PutBucketPolicy` events and analyze the policy document for external principals."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: This is the exact use case for which AWS IAM Access Analyzer was designed. By creating an analyzer at the organization level, it continuously monitors supported resources (like S3 buckets) for policies that grant access to principals outside the defined zone of trust (the organization). The key feature here is the use of **archive rules**, which allow you to automatically suppress findings that match specific criteria, such as access granted to a known and trusted third-party account. This provides a clean, automated, and managed solution without writing custom code.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This is a manual, custom solution for a problem that AWS provides a managed service for. It would require significant development and maintenance effort compared to using Access Analyzer. \n**B**: This AWS Config rule only checks for public access (e.g., for `AllUsers` or `AllAWSAccounts`). It does not detect specific cross-account access to an entity outside the organization, which is the core requirement. \n**D**: CloudTrail is a detective tool that records API calls. While you could analyze policy changes after the fact, it's not a continuous monitoring solution for the *state* of the policy itself. Access Analyzer continuously analyzes the policies as they exist, not just when they change."
  },
  {
    "number": 14,
    "title": "AWS Config Rules for Compliance",
    "scenario": "A financial services company must enforce a strict compliance regime. Two key requirements are: 1) All EBS volumes attached to EC2 instances must be encrypted. 2) Every EC2 instance must have a specific tag, `CostCenter`, with a value that exists in a predefined list of valid cost center codes, which is managed by the finance department in an external system.",
    "questionText": "Which combination of AWS Config rules should be implemented to automatically check for compliance with both of these requirements? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "The `encrypted-volumes` AWS managed rule."
      },
      {
        "letter": "B",
        "text": "A custom AWS Config rule powered by a Lambda function that retrieves the valid `CostCenter` codes and checks the instance tags against this list."
      },
      {
        "letter": "C",
        "text": "The `required-tags` AWS managed rule."
      },
      {
        "letter": "D",
        "text": "An AWS Service Control Policy (SCP) to deny the creation of unencrypted EBS volumes."
      },
      {
        "letter": "E",
        "text": "A custom AWS Config rule powered by a GuardDuty detector."
      }
    ],
    "correctAnswers": ["A", "B"],
    "explanation": "Why A and B are correct: \n**A** is correct because AWS provides a managed Config rule, **`encrypted-volumes`**, that does exactly what is required: it checks whether EBS volumes attached to instances are encrypted. Using a managed rule is the most efficient way to implement common compliance checks. **B** is correct because the second requirement involves custom validation logic (checking a tag's value against an external or dynamic list). The standard `required-tags` managed rule can only check for the presence of a tag, not the validity of its value. Therefore, a **custom Config rule** is necessary. This is implemented with an AWS Lambda function that can contain the logic to fetch the valid codes and perform the check, reporting the compliance status back to AWS Config.",
    "wrongExplanation": "Why the others are wrong: \n**C**: The `required-tags` managed rule can check if the `CostCenter` tag exists, but it cannot validate its value against a predefined list. \n**D**: An SCP is a preventative control, not a detective control. While useful for enforcement, the question asks how to use AWS Config rules to *check for compliance*, which is a detective action. \n**E**: GuardDuty is a threat detection service and cannot be used as the logic engine for a custom AWS Config rule."
  },
  {
    "number": 15,
    "title": "Amazon Inspector for Vulnerability Management",
    "scenario": "A company runs a large fleet of EC2 instances based on a standard Amazon Linux 2 AMI. They need to automate vulnerability scanning to identify both operating system package vulnerabilities (CVEs) and network reachability issues. The solution must provide continuous scanning without requiring manual installation of agents or scheduling of scan jobs. The results need to be centralized and correlated with other security findings.",
    "questionText": "How can Amazon Inspector be configured to meet these requirements?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Install the legacy Amazon Inspector Classic agent on each EC2 instance and create recurring assessment runs that target all instances."
      },
      {
        "letter": "B",
        "text": "Enable the new Amazon Inspector (v2) at the AWS Organization level. Ensure all EC2 instances are managed by AWS Systems Manager (SSM) and have the SSM Agent installed."
      },
      {
        "letter": "C",
        "text": "Deploy an AWS Config rule that triggers a vulnerability scan whenever an EC2 instance configuration changes."
      },
      {
        "letter": "D",
        "text": "Use AWS Security Hub to run vulnerability scans and aggregate the findings from EC2 instances."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: The new version of **Amazon Inspector (v2)** is designed to address exactly these requirements. It provides automated, continuous vulnerability management. A key feature is its integration with **AWS Systems Manager (SSM)**. Instead of a dedicated Inspector agent, it leverages the ubiquitous SSM Agent to collect software inventory from the instances. By enabling Inspector at the organization level, all member accounts and their compatible resources (including EC2 instances with the SSM agent) are automatically discovered and scanned continuously for both package vulnerabilities and network exposure without any manual intervention.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Amazon Inspector Classic is the legacy version. It requires a dedicated agent and manual scheduling of assessment runs, which does not meet the requirement for continuous, automated scanning. \n**C**: AWS Config is a service for assessing resource configurations, not for performing deep vulnerability scans of the software packages within an EC2 instance. \n**D**: AWS Security Hub is a service for aggregating security findings from various services (including Inspector), but it does not perform the vulnerability scans itself. It relies on services like Inspector to generate the findings that it then aggregates."
  },
  {
    "number": 16,
    "title": "AWS GuardDuty Threat Detection Sources",
    "scenario": "A security analyst is reviewing AWS GuardDuty findings and notices a high-severity finding titled `UnauthorizedAccess:IAMUser/AnomalousBehavior`. The finding details indicate that an IAM user's credentials were used to make unusual API calls from a previously unseen IP address and geographic location. The analyst needs to understand how GuardDuty was able to detect this anomaly.",
    "questionText": "Which data source is PRIMARY for generating this specific type of IAM user behavior finding?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Amazon Inspector scan results"
      },
      {
        "letter": "B",
        "text": "AWS CloudTrail management event logs"
      },
      {
        "letter": "C",
        "text": "VPC Flow Logs"
      },
      {
        "letter": "D",
        "text": "AWS WAF access logs"
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: GuardDuty is an intelligent threat detection service that analyzes multiple data sources. However, for findings specifically related to IAM user behavior, the **primary** data source is **AWS CloudTrail management event logs**. GuardDuty continuously processes these logs to build a baseline of normal API activity for each user (e.g., what APIs they call, from what IP addresses, at what times). The `AnomalousBehavior` finding is generated when GuardDuty detects a significant deviation from this established baseline, such as API calls from a new country or the use of APIs that the user has never invoked before. While other logs are used by GuardDuty for other findings, CloudTrail is the key to IAM user behavior analysis.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Inspector results are about known software vulnerabilities (CVEs) on resources, not about the real-time behavior of IAM principals. \n**C**: VPC Flow Logs are a critical data source for network-based threats (like port scanning or communication with malicious IPs), but they don't contain information about which IAM user made an API call. \n**D**: AWS WAF logs relate to web request patterns at Layer 7 against a specific web application and are not a data source for GuardDuty's analysis of general IAM user API behavior."
  },
  {
    "number": 17,
    "title": "AWS Networking at the Edge",
    "scenario": "A global gaming company is launching a new multiplayer game that requires ultra-low latency communication between players and the game servers, which are hosted in multiple AWS regions. The company wants to provide a stable, high-performance network path for their players, shielding them from the variability of the public internet. They also need static, anycast IP addresses to serve as the single entry point for players worldwide.",
    "questionText": "Which AWS service is specifically designed to provide these capabilities?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Amazon CloudFront"
      },
      {
        "letter": "B",
        "text": "AWS Direct Connect"
      },
      {
        "letter": "C",
        "text": "AWS Global Accelerator"
      },
      {
        "letter": "D",
        "text": "An internet-facing Network Load Balancer"
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: **AWS Global Accelerator** is the service purpose-built for this use case. It provides two **static anycast IP addresses** that act as a fixed entry point to your application. When a user connects to one of these IPs, their traffic is routed from the nearest AWS edge location across the congested, high-performance AWS global network backbone to the optimal application endpoint (e.g., an ALB or EC2 instance) in the healthiest, closest region. This significantly improves performance and reliability for latency-sensitive applications like gaming by avoiding the unpredictable public internet.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Amazon CloudFront is a content delivery network (CDN) optimized for caching and serving static and dynamic HTTP/HTTPS content. It is not designed for general-purpose, non-HTTP gaming traffic. \n**B**: AWS Direct Connect provides a private, dedicated network connection from an on-premises data center to AWS. It does not help improve the connection for public internet users. \n**D**: A Network Load Balancer provides a regional endpoint. Users from around the world would still have to traverse the public internet to reach that regional NLB, experiencing variable latency. It does not provide the global routing optimization that Global Accelerator does."
  },
  {
    "number": 18,
    "title": "AWS CloudFront with Origin Shield",
    "scenario": "A global media company uses Amazon CloudFront to distribute large video files stored in an S3 bucket in `us-east-1`. They have a global audience, and they observe that when a new video is released, many different CloudFront edge locations simultaneously request the same file from the S3 origin, causing a high request load on S3. They want to optimize this by introducing a caching layer between the edge locations and the S3 origin to reduce origin fetch requests.",
    "questionText": "Which CloudFront feature should be implemented to achieve this goal?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Increase the TTL (Time To Live) in the CloudFront cache behavior settings to a very high value."
      },
      {
        "letter": "B",
        "text": "Enable CloudFront Origin Shield by selecting a specific AWS region to act as a centralized caching layer."
      },
      {
        "letter": "C",
        "text": "Create a second CloudFront distribution and chain it to the first distribution."
      },
      {
        "letter": "D",
        "text": "Configure a Lambda@Edge function on the `origin-request` event to cache objects in an ElastiCache cluster."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **CloudFront Origin Shield** is a feature designed specifically for this use case. It acts as an additional layer of caching within the CloudFront network, positioned in front of your origin. When you enable Origin Shield, you choose an AWS Region to serve as this central cache. All requests from all other CloudFront edge locations that result in a cache miss will be routed to the Origin Shield region first. If Origin Shield has the object cached, it serves it directly to the edge location. Only if Origin Shield also has a cache miss will a single request be sent to the actual origin (the S3 bucket). This dramatically reduces the number of requests hitting your origin, lowering load and egress costs.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Increasing the TTL will keep objects in the edge caches longer, but it will not solve the initial \"thundering herd\" problem where many edge locations request the object from the origin for the very first time. \n**C**: Chaining distributions is not a standard or supported pattern and would be overly complex and inefficient. \n**D**: This is an extremely complex and expensive way to build a caching layer that CloudFront provides as a simple, built-in feature with Origin Shield."
  },
  {
    "number": 19,
    "title": "AWS PrivateLink and VPC Endpoints",
    "scenario": "A company has a fleet of EC2 instances running in a private subnet with no Internet Gateway or NAT Gateway. These instances need to upload large files to an S3 bucket and retrieve parameters from AWS Systems Manager (SSM) Parameter Store, both in the same region. The solution must ensure that all traffic to these AWS services remains on the AWS private network and does not traverse the public internet. Cost optimization is also a factor.",
    "questionText": "Which type of VPC endpoints should be created to provide the required connectivity most cost-effectively?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "A Gateway endpoint for S3 and an Interface endpoint for SSM."
      },
      {
        "letter": "B",
        "text": "An Interface endpoint for S3 and an Interface endpoint for SSM."
      },
      {
        "letter": "C",
        "text": "A Gateway endpoint for both S3 and SSM."
      },
      {
        "letter": "D",
        "text": "A single Gateway Load Balancer endpoint that routes traffic to both S3 and SSM."
      }
    ],
    "correctAnswers": ["A"],
    "explanation": "Why A is correct: This question tests the knowledge of the two main types of VPC endpoints. **Gateway endpoints** are a specific type used for connecting to S3 and DynamoDB. They work by adding an entry to the VPC's route table to direct traffic destined for the service to the endpoint instead of the internet. They are highly efficient and have no associated data processing or hourly charges. **Interface endpoints** (powered by AWS PrivateLink) create an elastic network interface (ENI) inside your subnet with a private IP address. Nearly all other AWS services, including AWS Systems Manager (SSM), use Interface endpoints. They have hourly and data processing costs. Therefore, the correct and most cost-effective combination is a Gateway endpoint for S3 and an Interface endpoint for SSM.",
    "wrongExplanation": "Why the others are wrong: \n**B**: While you can create an Interface endpoint for S3, Gateway endpoints for S3 are generally more cost-effective as they don't have the hourly and data processing charges that interface endpoints do. \n**C**: SSM does not support Gateway endpoints; it requires an Interface endpoint. \n**D**: A Gateway Load Balancer is used to deploy and manage third-party virtual appliances, not to provide connectivity to AWS services like S3 and SSM."
  },
  {
    "number": 20,
    "title": "Configuring Amazon Elastic Block Store (Amazon EBS)",
    "scenario": "A database administrator is configuring a new Amazon EBS volume for a business-critical database that requires the highest possible durability and resilience against failures within a single Availability Zone. The application also requires consistent, high I/O performance. Cost is a secondary concern to durability.",
    "questionText": "Which Amazon EBS volume type offers the highest level of durability, designed for an annual failure rate (AFR) of 0.001%, which translates to a single volume failure per 100,000 running volumes per year?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "General Purpose SSD (gp3)"
      },
      {
        "letter": "B",
        "text": "Provisioned IOPS SSD (io2 Block Express)"
      },
      {
        "letter": "C",
        "text": "Throughput Optimized HDD (st1)"
      },
      {
        "letter": "D",
        "text": "Cold HDD (sc1)"
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: Amazon **Provisioned IOPS SSD (io2)** volumes are engineered to provide the highest durability of any EBS volume type, with a 99.999% durability (a 100x improvement over other volume types). This corresponds to an annual failure rate (AFR) of just 0.001%. This makes `io2` and its higher-performance variant, **`io2 Block Express`**, the ideal choice for business-critical applications like databases where data durability and resilience are the absolute top priorities. In addition, it provides the highest performance capabilities.",
    "wrongExplanation": "Why the others are wrong: \n**A**: `gp3` volumes are highly durable with an AFR between 0.1% - 0.2%, but this is not as high as the durability offered by `io2`. \n**C**: `st1` is an HDD-based volume optimized for throughput, not for the high IOPS and low latency required by a transactional database, and it has a lower durability profile than SSD volumes. \n**D**: `sc1` is the lowest-cost HDD storage, designed for infrequently accessed data, and is not suitable for a performance-sensitive database."
  },
  {
    "number": 21,
    "title": "Sizing Amazon EBS Volumes for Performance",
    "scenario": "An administrator is provisioning a new Amazon EBS volume for a latency-sensitive database on an EC2 Nitro-based instance. The workload requires a consistent 1,000 MB/s of throughput and 15,000 IOPS, but storage capacity needs are low, only requiring 300 GiB. The administrator wants to use the most modern and cost-effective volume type that allows for independent provisioning of capacity, IOPS, and throughput.",
    "questionText": "Which EBS volume type and configuration should be chosen?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "A Provisioned IOPS SSD (`io2`) volume of 300 GiB, as it provides the highest performance."
      },
      {
        "letter": "B",
        "text": "A General Purpose SSD (`gp2`) volume of 5000 GiB to achieve the required 15,000 IOPS."
      },
      {
        "letter": "C",
        "text": "A General Purpose SSD (`gp3`) volume of 300 GiB, with IOPS configured to 15,000 and throughput configured to 1,000 MB/s."
      },
      {
        "letter": "D",
        "text": "A Throughput Optimized HDD (`st1`) volume of 2000 GiB to achieve the 1,000 MB/s throughput."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: This scenario is the ideal use case for a **General Purpose SSD (`gp3`)** volume. The key feature of `gp3` is the ability to provision IOPS and throughput independently of storage size. This directly addresses the requirement of high performance on a small-capacity volume. The administrator can create a 300 GiB volume and separately configure it for 15,000 IOPS and 1,000 MB/s throughput (both within the `gp3` maximums), providing the required performance in a very cost-effective manner without paying for unneeded storage capacity.",
    "wrongExplanation": "Why the others are wrong: \n**A**: While `io2` offers high performance, its IOPS and throughput still have some dependency on size, and it is a more expensive volume type than `gp3`. For this workload, `gp3` meets the requirements more cost-effectively. \n**B**: With `gp2`, performance is tied directly to size (3 IOPS per GiB). To get 15,000 IOPS, you would need a 5000 GiB volume, forcing you to pay for a massive amount of storage that isn't needed. \n**D**: HDD-based volumes like `st1` are designed for large, sequential throughput workloads and are not suitable for the low-latency, high-IOPS demands of a database."
  },
  {
    "number": 22,
    "title": "Using Amazon EBS Snapshots",
    "scenario": "A developer has created an EBS snapshot of a 1 TiB `gp3` volume that was fully provisioned with data. They need to create a new, identical volume from this snapshot as quickly as possible to launch a new test environment. The performance of the new volume must be at its maximum provisioned level immediately upon creation, without any warm-up period.",
    "questionText": "What is the fastest way to create a fully performant volume from the snapshot?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create a new volume from the snapshot and wait for the lazy loading process to complete in the background."
      },
      {
        "letter": "B",
        "text": "Create a new volume from the snapshot and immediately attach it to an instance and start reading all blocks on the volume using a tool like `dd`."
      },
      {
        "letter": "C",
        "text": "Enable Fast Snapshot Restore (FSR) on the snapshot in the required Availability Zone before creating the new volume from it."
      },
      {
        "letter": "D",
        "text": "Create a new, empty volume of the same size and use a third-party tool to perform a block-level copy from the original volume."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: Standard EBS volumes created from snapshots use a process called lazy loading, where data is downloaded from S3 to the EBS volume on demand when a block is first accessed. This can cause high initial latency. **Fast Snapshot Restore (FSR)** is the feature designed to eliminate this latency. When you enable FSR on a snapshot, AWS pre-provisions fully hydrated volumes from that snapshot in the background. When you then create a new volume from the FSR-enabled snapshot, it is fully initialized and delivers its maximum provisioned performance immediately, with no warm-up period required.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This is the default behavior and would result in a performance-degraded warm-up period, which violates the requirement for immediate maximum performance. \n**B**: This is a manual way of forcing the lazy loading process to complete, but it is slow, requires manual effort, and is much less efficient than using the managed FSR feature. \n**D**: This is a complex and slow process that requires the original volume to still be available and is not the standard way to create volumes from backups (snapshots)."
  },
  {
    "number": 23,
    "title": "Creating Backup and Data Recovery Plans",
    "scenario": "A company is using AWS Backup to manage backups for its Amazon RDS databases and Amazon EBS volumes in the `us-west-2` region. They have a disaster recovery (DR) requirement that all backups must be copied to a secondary region (`ap-southeast-1`) and retained there for one year. The original backups in `us-west-2` only need to be retained for 30 days. The process must be fully automated.",
    "questionText": "Which two configurations within AWS Backup are necessary to achieve this? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "Create a backup plan with a backup rule that has a 30-day retention period in the source region's vault."
      },
      {
        "letter": "B",
        "text": "Create a backup plan with a backup rule that has a 1-year retention period and targets a vault in the destination region."
      },
      {
        "letter": "C",
        "text": "Configure Vault Lock in WORM mode on the destination vault to enforce the 1-year retention."
      },
      {
        "letter": "D",
        "text": "In the backup rule for the source region, add a 'Copy to destination' action."
      },
      {
        "letter": "E",
        "text": "In the copy action, specify the destination region and set the retention period for the copied backups to 1 year."
      }
    ],
    "correctAnswers": ["D", "E"],
    "explanation": "Why D and E are correct: \nAWS Backup provides a comprehensive way to manage backup lifecycles, including cross-region copies. The primary backup rule defines the source backup's lifecycle. To meet the DR requirement, you must use the integrated copy feature. **D** is correct because the **'Copy to destination'** action, added to the primary backup rule, is the specific feature that initiates the cross-region copy. **E** is correct because this copy action is where you configure the independent lifecycle for the copied backup. You specify the destination region and vault, and crucially, set the separate, longer retention period (1 year) for that copy. Combining the copy action with its own retention setting within the primary rule centralizes the entire DR strategy.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This only defines the source backup; it does not implement the DR copy. \n**B**: A single rule cannot directly back up to a vault in another region. The backup is always created in the source region first, and then copied. \n**C**: Vault Lock is a compliance feature to make backups immutable. While it can enforce retention, it is not the mechanism used to create the copy itself. The copy action is required first."
  },
  {
    "number": 24,
    "title": "Configuring Shared File System Storage",
    "scenario": "A media production company needs a shared file system for a video editing application running on a fleet of Windows Server EC2 instances. The application requires full SMB protocol support, integration with the company's existing on-premises Active Directory for authentication, and the ability to scale storage capacity and performance automatically. The file system must provide high levels of throughput and IOPS to handle large video file rendering.",
    "questionText": "Which AWS storage service is the most suitable choice for this workload?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Amazon EFS with a mount target in the VPC."
      },
      {
        "letter": "B",
        "text": "Amazon S3 with the AWS CLI used for file access."
      },
      {
        "letter": "C",
        "text": "Amazon FSx for Windows File Server."
      },
      {
        "letter": "D",
        "text": "An Amazon EBS io2 volume shared between the instances using EBS Multi-Attach."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: **Amazon FSx for Windows File Server** is the purpose-built service for this use case. It provides a fully managed, native Microsoft Windows file system that supports the **SMB protocol**, which is essential for Windows-based applications. It can be joined to an existing **Active Directory** for seamless authentication and access control. It also offers different performance tiers (SSD, HDD) and allows you to independently scale storage, throughput capacity, and IOPS to meet the high-performance demands of video editing.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Amazon EFS is a file system for Linux-based workloads that uses the NFS protocol. It does not support SMB. \n**B**: Amazon S3 is an object storage service, not a file system. It does not provide the file-level locking and low-latency file system semantics required by an application like a video editor. \n**D**: EBS Multi-Attach allows a single volume to be attached to multiple instances, but it is not a shared file system. It requires a cluster-aware file system (like GFS2 or OCFS2) to be installed and managed on the instances to coordinate access, and it is primarily for Linux instances."
  },
  {
    "number": 25,
    "title": "AWS Cost and Usage Awareness",
    "scenario": "A finance manager needs to analyze the company's AWS spending patterns over the last 12 months. They need to see a detailed breakdown of costs by service, linked account, and a custom tag named `Project`. They also want to visualize monthly spending trends and identify the biggest contributors to their AWS bill. The manager does not have technical expertise and needs a user-friendly interface.",
    "questionText": "Which AWS service should the manager use to perform this historical cost analysis?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Amazon CloudWatch, by creating a dashboard of cost metrics."
      },
      {
        "letter": "B",
        "text": "AWS Budgets, by setting up a budget for each project."
      },
      {
        "letter": "C",
        "text": "AWS Cost Explorer."
      },
      {
        "letter": "D",
        "text": "The AWS Cost and Usage Report (CUR) queried with Amazon Athena."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: **AWS Cost Explorer** is the ideal tool for this requirement. It provides a user-friendly, graphical interface specifically designed for visualizing, understanding, and managing AWS costs and usage over time. It allows users to view data for up to the last 12 months, group and filter costs by various dimensions including **service, linked account, and tags** (like the `Project` tag), and view trends through intuitive charts and reports. This directly meets all the manager's needs without requiring any technical querying skills.",
    "wrongExplanation": "Why the others are wrong: \n**A**: CloudWatch is primarily for performance and operational metrics, not for detailed cost analysis. While it has some billing metrics, it lacks the deep filtering and reporting capabilities of Cost Explorer. \n**B**: AWS Budgets are for setting spending limits and receiving alerts when those limits are approached or exceeded. They are for cost control and forecasting, not for deep historical analysis and visualization. \n**D**: The Cost and Usage Report (CUR) with Athena provides the most granular data possible, but it requires technical expertise to set up the data pipeline and write complex SQL queries. This is not suitable for a non-technical finance manager."
  },
  {
    "number": 26,
    "title": "Using Control Mechanisms for AWS Cost Management",
    "scenario": "A large enterprise with many development teams uses AWS Organizations. The finance department wants to enforce two distinct financial controls: 1) Prevent any developer in a non-production account from launching a GPU-accelerated EC2 instance (e.g., `p4d.24xlarge`), as these are extremely expensive and should only be used in specific research accounts. 2) Gain significant discounts on the company's predictable, baseline EC2 usage across all accounts.",
    "questionText": "Which two AWS features should be used in combination to implement these preventative and cost-saving controls? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "An IAM identity-based policy attached to each developer's IAM user that denies launching specific instance types."
      },
      {
        "letter": "B",
        "text": "A Service Control Policy (SCP) applied to the development OU that denies the `ec2:RunInstances` action if the requested instance type is from a GPU family."
      },
      {
        "letter": "C",
        "text": "AWS Budgets configured with an action to stop instances when a budget threshold is exceeded."
      },
      {
        "letter": "D",
        "text": "Compute Savings Plans purchased in the organization's management account."
      },
      {
        "letter": "E",
        "text": "EC2 Reserved Instances purchased in each individual developer account."
      }
    ],
    "correctAnswers": ["B", "D"],
    "explanation": "Why B and D are correct: \n**B** is correct because **Service Control Policies (SCPs)** are the appropriate mechanism for setting preventative guardrails across accounts in an AWS Organization. An SCP can be crafted with a `Deny` statement using a condition key (`ec2:InstanceType`) to block the launch of specific instance types or families. This policy, applied at the Organizational Unit (OU) level, cannot be overridden by IAM admins in the member accounts, effectively enforcing the control. **D** is correct because **Compute Savings Plans** are a flexible pricing model that provides significant discounts in exchange for a commitment to a consistent amount of compute usage (measured in $/hour). When purchased in the management account, the discount benefits are automatically shared and applied across all linked accounts in the organization, making it the ideal way to get discounts on the company's aggregate baseline usage.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Managing individual IAM policies for hundreds of developers is not scalable and is prone to error. An SCP provides a centralized, enforceable guardrail. \n**C**: AWS Budgets are a detective control, not preventative. They alert you or take action *after* a cost has been incurred, they don't prevent the expensive resource from being launched in the first place. \n**E**: Purchasing Reserved Instances in each account is inefficient. Savings Plans purchased at the management account level provide more flexibility (applying to any instance family/region) and are shared automatically, simplifying management."
  }
]
