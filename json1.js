const cookie_name = "json1";
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
    "title": "Elastic Load Balancing for Mutual TLS Passthrough",
    "scenario": "A financial services company is deploying a critical, non-HTTP service on a fleet of EC2 instances. The service uses mutual TLS (mTLS) for authentication, meaning both the client and the server must validate each other's certificates during the TLS handshake. For compliance, the backend EC2 instances must terminate the TLS connection themselves to have full control over the handshake and to see the original, unmodified client source IP address. The load balancer must also provide a stable, static IP address for client firewalls.",
    "questionText": "Which ELB configuration should be used to meet all of these requirements?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "An Application Load Balancer (ALB) with a TLS listener configured to forward requests to the instances."
      },
      {
        "letter": "B",
        "text": "A Network Load Balancer (NLB) with a TLS listener and a security policy that supports mTLS."
      },
      {
        "letter": "C",
        "text": "A Classic Load Balancer with a TCP listener and Proxy Protocol enabled."
      },
      {
        "letter": "D",
        "text": "A Network Load Balancer (NLB) with a TCP listener. Associate an Elastic IP address with the NLB."
      }
    ],
    "correctAnswers": ["D"],
    "explanation": "Why D is correct: The critical requirement is that the backend instances handle the TLS handshake for mTLS. This means the load balancer must operate in a passthrough mode. A **Network Load Balancer (NLB) with a TCP listener** operates at Layer 4 and forwards the raw TCP traffic directly to the target instance. It does not terminate the TLS connection, allowing the end-to-end mTLS handshake to occur between the client and the instance. NLBs also preserve the client's source IP address by default and support assigning a static **Elastic IP address**, fulfilling all requirements.",
    "wrongExplanation": "Why the others are wrong: \n**A**: An Application Load Balancer is a Layer 7 proxy that *must* terminate the TLS connection to inspect HTTP traffic. This would break the end-to-end mTLS handshake required by the backend. \n**B**: A Network Load Balancer with a TLS listener *also* terminates the TLS connection at the load balancer. While it can be configured to validate client certificates, it does not pass the handshake through to the backend, which violates the requirement for the instance to terminate TLS. \n**C**: A Classic Load Balancer is a legacy product and is not recommended for new applications. While it can pass through TCP traffic, an NLB offers superior performance, features, and integration with other AWS services like static IPs."
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
    "title": "AWS IAM Access Analyzer for Policy Generation",
    "scenario": "A development team has created a new IAM role for a complex application running on an EC2 instance. The team is unsure of the exact, minimal set of permissions the application needs to function correctly. They want to avoid granting overly permissive access (like `s3:*`). The goal is to generate a least-privilege IAM policy based on the application's actual API activity over a testing period.",
    "questionText": "Which AWS IAM Access Analyzer feature should be used to achieve this?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create an archive rule to filter out unnecessary findings."
      },
      {
        "letter": "B",
        "text": "Use the IAM Access Analyzer findings to identify external access and then manually write a policy to remove it."
      },
      {
        "letter": "C",
        "text": "Use IAM Access Analyzer's policy generation feature, which analyzes AWS CloudTrail logs to create a fine-grained policy based on the access activity of the role."
      },
      {
        "letter": "D",
        "text": "Validate the role's existing policy using IAM Access Analyzer's policy validation checks to check for syntax errors."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: **IAM Access Analyzer's policy generation** is a specific feature designed for this exact use case. It actively monitors the AWS CloudTrail logs for a specified IAM role or user over a period of time. It then analyzes all the API calls made by that principal and generates a fine-grained, least-privilege IAM policy that includes only the actions that were actually used. This allows developers to start with a broader set of permissions during development and then easily tighten them down to a secure, least-privilege policy before moving to production.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Archive rules are for suppressing findings from external access analysis; they do not generate policies. \n**B**: Analyzing findings is for identifying potential security risks from existing policies, not for generating new policies based on activity. \n**D**: Policy validation checks for syntax errors and best practices in a policy you have already written; it does not generate a policy based on usage."
  },
  {
    "number": 5,
    "title": "AWS IAM Permission Boundaries",
    "scenario": "A company wants to delegate permissions to developers to create and manage their own IAM roles for their applications. However, the central security team wants to ensure that no developer can create a role that has more permissions than the developer themselves, nor can they create a role with permissions to access sensitive services like AWS Organizations or IAM. The solution must be a preventative guardrail that cannot be bypassed by the developers.",
    "questionText": "Which IAM feature should the security team implement to enforce this level of control?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "A Service Control Policy (SCP) that denies the `iam:CreateRole` action."
      },
      {
        "letter": "B",
        "text": "An IAM permissions boundary attached to the developers' IAM users or roles."
      },
      {
        "letter": "C",
        "text": "An IAM identity-based policy with an explicit `Deny` for the sensitive services."
      },
      {
        "letter": "D",
        "text": "AWS Config rules to detect when a role with excessive permissions is created."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: An **IAM permissions boundary** is a feature designed specifically for this delegation use case. It is a managed policy that is used to set the maximum permissions that an identity-based policy can grant to an IAM entity. When a developer creates a new role, they can attach policies to it, but the effective permissions of that new role will be the intersection of the policies they attach AND the permissions boundary. By setting a boundary that excludes `iam:*` and `organizations:*`, the security team ensures that no role created by a developer can ever have those permissions, even if the developer tries to attach a policy that includes them.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This would prevent developers from creating any roles at all, which violates the requirement to delegate that ability. \n**C**: While a `Deny` policy on the developer's user is effective for that user, a permissions boundary is what constrains the permissions of the *new roles* the developer creates. \n**D**: AWS Config is a detective control. It can report on a non-compliant role after it has been created, but a permissions boundary is a preventative control that stops the over-privileged role from being created with effective permissions in the first place."
  },
  {
    "number": 6,
    "title": "AWS Systems Manager for Patch Management",
    "scenario": "An organization needs to automate patching for a large fleet of Windows and Linux EC2 instances across multiple AWS accounts. The patching process must be scheduled to run during a specific maintenance window every Sunday. The process must use a pre-approved set of patches defined in a patch baseline, which includes an approval delay of 7 days for all critical updates to allow for testing. The solution must be scalable and managed centrally.",
    "questionText": "Which two AWS Systems Manager capabilities should be used together to implement this solution? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "Systems Manager Run Command"
      },
      {
        "letter": "B",
        "text": "Systems Manager Patch Manager"
      },
      {
        "letter": "C",
        "text": "Systems Manager Distributor"
      },
      {
        "letter": "D",
        "text": "Systems Manager Maintenance Windows"
      },
      {
        "letter": "E",
        "text": "Systems Manager Session Manager"
      }
    ],
    "correctAnswers": ["B", "D"],
    "explanation": "Why B and D are correct: \nThis scenario requires a combination of defining patching rules and scheduling their execution. **B** is correct because **Patch Manager** is the specific SSM capability for defining patching rules. It allows you to create patch baselines that specify auto-approval rules (e.g., by classification and severity) and, crucially, approval delays. This is where the 7-day delay for critical updates would be configured. **D** is correct because **Maintenance Windows** is the SSM capability for defining recurring, scheduled windows of time during which you can safely perform disruptive actions like patching. You would register the Patch Manager `Scan and Install` task within the maintenance window to ensure the patching operation runs only on Sundays at the specified time.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Run Command is for executing ad-hoc, one-time commands. It is not suitable for a recurring, scheduled, and rule-based process like this. \n**C**: Distributor is for packaging and distributing your own software, not for managing OS patches. \n**E**: Session Manager is for providing interactive shell access to instances; it is not involved in automated patching."
  },
  {
    "number": 7,
    "title": "AWS Session Manager for Secure Access",
    "scenario": "A company wants to provide its developers with secure shell access to a fleet of Linux EC2 instances running in a private subnet. For security and compliance, all session activity must be logged to a central S3 bucket. Furthermore, access must be controlled via IAM, and developers should not need to manage SSH keys. The solution must not require opening any inbound ports on the instances' security groups.",
    "questionText": "What is the most appropriate AWS native service to meet all these requirements?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "AWS Systems Manager Session Manager"
      },
      {
        "letter": "B",
        "text": "An EC2 bastion host with carefully configured security groups."
      },
      {
        "letter": "C",
        "text": "EC2 Instance Connect"
      },
      {
        "letter": "D",
        "text": "AWS Client VPN"
      }
    ],
    "correctAnswers": ["A"],
    "explanation": "Why A is correct: **AWS Systems Manager Session Manager** is the purpose-built service that meets all of these requirements. It provides secure, auditable, and key-less interactive shell access to instances. It works through the SSM Agent and does not require any inbound ports (like port 22 for SSH) to be open. Access is controlled entirely through **IAM policies**, and it has native integration for logging all session output to either **Amazon S3** or CloudWatch Logs, fulfilling the compliance requirement.",
    "wrongExplanation": "Why the others are wrong: \n**B**: A bastion host still requires opening port 22 on the bastion itself and managing SSH keys, which violates the requirements. \n**C**: EC2 Instance Connect provides temporary, key-based SSH access but still requires opening port 22 on the instance's security group. It also does not provide native session logging. \n**D**: A Client VPN provides network-level access to the VPC but does not, by itself, provide shell access. It would still need to be combined with a method like SSH, which would require open ports and key management."
  },
  {
    "number": 8,
    "title": "AWS Systems Manager State Manager",
    "scenario": "An organization needs to ensure that a specific security agent is always running on its entire fleet of EC2 instances. If the agent is not installed or if its service is stopped, it must be automatically remediated. Additionally, the compliance status of every instance (i.e., whether the agent is installed and running) must be continuously tracked and available for reporting.",
    "questionText": "Which AWS Systems Manager capability is best suited to enforce this desired state and track compliance?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Use Run Command to periodically execute a script that checks for the agent and installs it if missing."
      },
      {
        "letter": "B",
        "text": "Use State Manager to create an association with the `AWS-ConfigureAWSPackage` document to install the agent and the `AWS-RunPowerShellScript` document to check the service status."
      },
      {
        "letter": "C",
        "text": "Use Inventory to collect information about the installed software, then manually run a command to remediate non-compliant instances."
      },
      {
        "letter": "D",
        "text": "Use Maintenance Windows to schedule a recurring check for the agent."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **AWS Systems Manager State Manager** is the capability designed to define and maintain a consistent configuration on your instances. You create an **association** that links a desired state (defined in an SSM Document) to a set of target instances. State Manager will then automatically apply this configuration on a schedule and re-apply it if the instance deviates from the desired state (e.g., if the agent is uninstalled). It also continuously reports on the compliance status of each instance against the association. Using pre-built documents like `AWS-ConfigureAWSPackage` to install software and `AWS-RunPowerShellScript` or `AWS-RunShellScript` to check a service status is the standard way to implement this.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Run Command is for ad-hoc, one-time executions. It does not provide the continuous enforcement and compliance tracking that State Manager does. \n**C**: Inventory is for collecting data, not for enforcing a state. It is a detective tool, while State Manager is a preventative and corrective tool. \n**D**: Maintenance Windows are for scheduling potentially disruptive actions during a specific window. State Manager is for ensuring a continuous state of compliance at all times."
  },
  {
    "number": 9,
    "title": "Elastic Load Balancing for Static IP and L7 Routing",
    "scenario": "A company hosts multiple distinct services on a single fleet of EC2 instances. They use an Application Load Balancer (ALB) with host-based routing rules (e.g., api.example.com, app.example.com) to direct traffic to the correct service. A key business partner needs to whitelist a single, stable, static IP address to send traffic to the services. An ALB does not provide a static IP address.",
    "questionText": "What is the most effective way to meet the requirement for a static IP address while retaining the host-based routing functionality of the ALB?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Replace the Application Load Balancer with a Network Load Balancer, as it supports static IPs."
      },
      {
        "letter": "B",
        "text": "Place a Network Load Balancer (NLB) with an assigned Elastic IP in front of the Application Load Balancer. The NLB will target the ALB."
      },
      {
        "letter": "C",
        "text": "Use AWS Global Accelerator and register the Application Load Balancer as an endpoint."
      },
      {
        "letter": "D",
        "text": "Request a static IP address for the Application Load Balancer via a support ticket."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This describes a common and effective architectural pattern. An Application Load Balancer (ALB) provides the required Layer 7 routing logic but has dynamic IP addresses. A Network Load Balancer (NLB) can be assigned a static Elastic IP address but operates at Layer 4 and cannot perform host-based routing. By **placing an NLB in front of the ALB** and making the ALB the target of the NLB, you get the best of both worlds. The partner connects to the NLB's static IP, and the NLB forwards the raw TCP traffic to the ALB, which then performs the necessary L7 routing to the backend instances. While Global Accelerator (Option C) is another valid solution, the NLB-ALB pattern is a direct, in-VPC solution for this specific problem.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Replacing the ALB with an NLB would solve the static IP requirement but remove the critical Layer 7 host-based routing functionality. \n**C**: AWS Global Accelerator is an excellent solution for this, but the NLB-ALB pattern is also a correct and widely used solution. In a professional context, both are valid, but the NLB-ALB pattern is often preferred for in-region, non-global use cases. This question tests the knowledge of load balancer chaining. \n**D**: Application Load Balancers are designed to be highly scalable and do not support being assigned a single static IP address. This is a fundamental design characteristic."
  },
  {
    "number": 10,
    "title": "Route 53 Geoproximity Routing with Traffic Flow",
    "scenario": "A company has application endpoints in three AWS Regions: US West (Oregon), Europe (Ireland), and Asia Pacific (Sydney). They want to route users to the geographically closest region to minimize latency. However, for users in South America, they want to route 75% of the traffic to Oregon and 25% to Ireland, overriding the normal proximity calculation to balance load on a new feature deployed in those regions. This special routing rule should not affect users from other continents.",
    "questionText": "How can this complex routing policy be implemented using Amazon Route 53?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create a single Geoproximity routing policy and define biases for the Oregon and Ireland endpoints to attract more traffic from South America."
      },
      {
        "letter": "B",
        "text": "Create a Latency routing policy for each region and use weighted records for the South American continent."
      },
      {
        "letter": "C",
        "text": "Use Route 53 Traffic Flow to create a policy. Start with a Geolocation rule for the South American continent that points to a Weighted rule, which then distributes traffic to the Oregon and Ireland endpoints with a 75-25 split. The default Geolocation rule should point to a Geoproximity rule."
      },
      {
        "letter": "D",
        "text": "Create two separate hosted zones: one with a Geoproximity policy and one with a Weighted policy for South America. Use DNSSEC to chain the zones together."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: **Route 53 Traffic Flow** is a visual policy builder designed for creating sophisticated, nested routing policies like this one. The correct approach is to chain different rule types. You start with a **Geolocation** rule that matches traffic originating from South America. This rule's endpoint is not a direct resource but another rule: a **Weighted** rule. This nested Weighted rule is then configured with two endpoints (Oregon and Ireland) and weights of 75 and 25, respectively. For all other geographic locations (the `*` default location in the Geolocation rule), you point to a **Geoproximity** rule block to handle the standard lowest-latency routing. This combination provides the required conditional and weighted logic.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Geoproximity biases can influence traffic but do not provide the precise 75-25 percentage split that a Weighted policy does. It's less deterministic. \n**B**: You cannot combine Latency and Weighted policies in this way using standard records. Latency routing would send 100% of traffic to the lowest-latency endpoint for a given user, ignoring any weights. \n**D**: Chaining hosted zones with DNSSEC is not a mechanism for implementing conditional routing logic; it's for DNS security."
  },
  {
    "number": 11,
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
    "number": 12,
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
    "number": 13,
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
    "number": 14,
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
    "number": 15,
    "title": "Monitoring and Maintaining Healthy Workloads",
    "scenario": "An Auto Scaling group (ASG) manages a fleet of EC2 instances behind an Application Load Balancer (ALB). The ASG is configured to use ELB health checks. An administrator notices that when they deploy a new version of the application, instances running the old version are terminated immediately by the ASG, even if they are still processing long-running user requests. They need a way to ensure that instances are drained of existing connections before they are terminated during a scale-in event or deployment.",
    "questionText": "Which two configurations should be enabled to ensure graceful termination of instances? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "Configure a Lifecycle Hook for the `EC2_INSTANCE_TERMINATING` state in the Auto Scaling group."
      },
      {
        "letter": "B",
        "text": "Increase the Health Check Interval on the ALB health check."
      },
      {
        "letter": "C",
        "text": "Enable connection draining (deregistration delay) on the ALB's target group."
      },
      {
        "letter": "D",
        "text": "Increase the Unhealthy Threshold on the ELB health check to a high value."
      },
      {
        "letter": "E",
        "text": "Configure the ASG to use EC2 status checks instead of ELB health checks."
      }
    ],
    "correctAnswers": ["A", "C"],
    "explanation": "Why A and C are correct: \nThis is a classic operational excellence pattern. Two features work together here. **C** is correct because **connection draining** (also known as deregistration delay) on the ALB's target group tells the load balancer to stop sending *new* requests to an instance that is being deregistered, while allowing existing requests to complete, up to a configured timeout. **A** is correct because an Auto Scaling **Lifecycle Hook** for the `EC2_INSTANCE_TERMINATING` transition pauses the termination process itself. This gives the connection draining process time to complete gracefully before the ASG proceeds with actually terminating the instance. This combination ensures no user requests are abruptly cut off.",
    "wrongExplanation": "Why the others are wrong: \n**B**: Changing the health check interval only affects how frequently the ALB checks the instance's health; it does not help with connection draining. \n**D**: Increasing the unhealthy threshold would just make the instance appear healthy to the ALB for longer, delaying termination but not ensuring a graceful shutdown of existing connections. \n**E**: EC2 status checks only verify the underlying hypervisor and instance health. They have no knowledge of the application's state or active connections. ELB health checks are required for application-level health monitoring."
  },
  {
    "number": 16,
    "title": "Monitoring AWS Infrastructure",
    "scenario": "An operations team needs a comprehensive view of the health and performance of their core AWS infrastructure, which includes EC2 instances, EBS volumes, and an Application Load Balancer (ALB). They want to create a single, high-level dashboard that shows key performance indicators (KPIs) like average CPU Utilization for the EC2 fleet, the Disk I/O for critical EBS volumes, and the number of `HTTPCode_Target_5XX_Count` errors from the ALB. They also need to be alerted if any of these metrics breach predefined thresholds.",
    "questionText": "Which AWS service should be primarily used to create this monitoring and alerting solution?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "AWS CloudTrail"
      },
      {
        "letter": "B",
        "text": "Amazon CloudWatch"
      },
      {
        "letter": "C",
        "text": "AWS X-Ray"
      },
      {
        "letter": "D",
        "text": "AWS Health Dashboard"
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **Amazon CloudWatch** is the central monitoring and observability service in AWS. It is the service that collects all the specified metrics (EC2 CPU, EBS I/O, ALB errors) natively. It contains all the necessary features to meet the requirements: **CloudWatch Dashboards** for creating the single pane of glass visualization, and **CloudWatch Alarms** for setting up automated alerting based on metric thresholds. It is the single, primary service for this task.",
    "wrongExplanation": "Why the others are wrong: \n**A**: AWS CloudTrail is a service that records API activity in your account for auditing and governance. It does not track performance metrics like CPU utilization. \n**C**: AWS X-Ray is an application performance management (APM) service used for tracing requests through a distributed application. It is not used for monitoring raw infrastructure metrics like disk I/O. \n**D**: The AWS Health Dashboard provides information about the health of AWS services themselves, not the performance of your specific resources running on those services."
  },
  {
    "number": 17,
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
    "number": 18,
    "title": "Deploying Amazon S3 with Access Control",
    "scenario": "A company is using an S3 bucket to store sensitive financial reports. Access to these reports must be strictly controlled. An EC2 instance in a specific VPC needs read access to the reports, and an on-premises server, connected via Direct Connect, also needs read access. All other access, including from other resources within AWS and the public internet, must be denied, even by the AWS account root user.",
    "questionText": "Which S3 access control mechanism should be used to enforce these specific requirements?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "An IAM policy attached to the EC2 instance role and a separate IAM user for the on-premises server."
      },
      {
        "letter": "B",
        "text": "An S3 Access Control List (ACL) granting read access to the canonical user ID of the account."
      },
      {
        "letter": "C",
        "text": "An S3 bucket policy with `Deny` statements for all principals except when the request comes from the specified VPC endpoint or the source IP address from the on-premises network."
      },
      {
        "letter": "D",
        "text": "S3 Block Public Access enabled on the bucket."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: An **S3 bucket policy** is the only mechanism that can satisfy all the requirements. It is a resource-based policy that can grant or deny access based on multiple conditions. To meet the scenario's needs, the policy would have a primary `Deny` statement with a condition block that contains multiple negative conditions (e.g., `StringNotEquals` for `aws:sourceVpce` and `NotIpAddress` for `aws:SourceIp`). An explicit deny in a resource-based policy overrides other permissions, including those of the root user, effectively creating a network perimeter around the bucket.",
    "wrongExplanation": "Why the others are wrong: \n**A**: IAM policies can grant access, but they cannot easily enforce the network location constraints (VPC endpoint, on-premises IP) and cannot override an explicit deny in a bucket policy. \n**B**: S3 ACLs are a legacy access control mechanism and are not recommended for new use cases. They lack the conditional logic needed to specify network locations. \n**D**: S3 Block Public Access is a critical feature but is insufficient on its own. It prevents public access but does not control private access from specific network locations like a VPC endpoint or an on-premises IP."
  },
  {
    "number": 19,
    "title": "Managing Storage Lifecycles on Amazon S3",
    "scenario": "A financial services company ingests daily transaction logs into an S3 bucket. For compliance, these logs must be accessible with millisecond latency for the first 90 days for active analysis. After 90 days, they can be moved to a lower-cost storage tier suitable for infrequent access but must still be retrievable within minutes. After one year, the logs must be moved to the lowest-cost archival storage for long-term retention. Finally, after seven years, the logs must be permanently deleted.",
    "questionText": "Which S3 Lifecycle policy configuration correctly automates this tiered storage plan?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Transition objects to S3 Glacier after 90 days, then to S3 Standard-IA after one year, and expire them after seven years."
      },
      {
        "letter": "B",
        "text": "Transition objects to S3 Intelligent-Tiering for the first year, then to S3 Glacier Deep Archive, and expire them after seven years."
      },
      {
        "letter": "C",
        "text": "Store objects in S3 Standard. Create a rule to transition to S3 Standard-Infrequent Access after 90 days, then transition to S3 Glacier Deep Archive after 365 days, and finally, create an expiration action for 2555 days (7 years)."
      },
      {
        "letter": "D",
        "text": "Transition objects to S3 One Zone-IA after 90 days, then to S3 Glacier Flexible Retrieval, and enable S3 Object Lock for seven years."
      }
    ],
    "correctAnswers": ["C"],
    "explanation": "Why C is correct: This configuration correctly maps the requirements to the appropriate S3 storage classes and lifecycle actions. Objects start in **S3 Standard** for high-performance access. The first lifecycle rule transitions them to **S3 Standard-Infrequent Access (S3 Standard-IA)** after 90 days for cost savings on less frequently accessed data. The second rule transitions them to **S3 Glacier Deep Archive** after 365 days, which is the lowest-cost storage for long-term archival. The final **expiration action** permanently deletes the objects after the required seven-year retention period. This is the correct and logical tiering progression.",
    "wrongExplanation": "Why the others are wrong: \n**A**: The transition order is incorrect. You cannot transition objects from S3 Glacier back to S3 Standard-IA. The transition is always to a \"colder\" or lower-cost tier. \n**B**: S3 Intelligent-Tiering is for unpredictable access patterns. This scenario has a very predictable access pattern, so manual tiering is more cost-effective. \n**D**: S3 One Zone-IA is not suitable for this data as it is not resilient to the loss of an Availability Zone. S3 Object Lock is for immutability (WORM), not for managing a tiered lifecycle."
  },
  {
    "number": 20,
    "title": "Gaining AWS Cost and Usage Awareness",
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
    "number": 21,
    "title": "Using Control Mechanisms for Cost Management",
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
  },
  {
    "number": 22,
    "title": "Optimizing AWS Spend and Usage",
    "scenario": "A media company runs a complex workload on AWS. The workload consists of: 1) A core fleet of EC2 instances and RDS databases that provide a 24/7 baseline service, with predictable, stable usage. 2) A large, stateless fleet of EC2 instances used for video transcoding jobs that run for several hours each night, can be interrupted, and can tolerate a 10-20 minute delay in starting. 3) A development environment with sporadic EC2 usage that must be automatically shut down outside of business hours.",
    "questionText": "To achieve the maximum cost savings across this entire workload, which three distinct optimization mechanisms should be implemented?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Reserved Instances for the baseline fleet, Spot Instances for transcoding, and AWS Budgets for the development environment."
      },
      {
        "letter": "B",
        "text": "A Compute Savings Plan for the baseline fleet, Spot Instances for transcoding, and an instance scheduler for the development environment."
      },
      {
        "letter": "C",
        "text": "Spot Instances for all workloads to maximize savings."
      },
      {
        "letter": "D",
        "text": "AWS Cost Explorer for analysis, Reserved Instances for transcoding, and a scheduled scaling policy for development."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This answer correctly maps the most appropriate cost optimization strategy to each distinct workload. 1) A **Compute Savings Plan** is ideal for the predictable, baseline fleet because it provides significant discounts with the flexibility to change instance families or sizes. 2) **Spot Instances** are the perfect fit for the fault-tolerant, interruptible transcoding jobs, offering the deepest discounts. 3) An **instance scheduler** (like the AWS-provided solution or a custom Lambda) is the best way to save money on the development environment by simply turning off resources when they are not in use. This three-pronged approach maximizes savings by applying the right tool to the right job.",
    "wrongExplanation": "Why the others are wrong: \n**A**: AWS Budgets are for monitoring costs, not for scheduling or stopping instances. \n**C**: Using Spot Instances for the core 24/7 baseline fleet is too risky, as these instances could be interrupted, causing an outage. \n**D**: Reserved Instances are not suitable for the transient transcoding fleet, and Cost Explorer is an analysis tool, not an optimization mechanism."
  },
  {
    "number": 23,
    "title": "Configuring Amazon EBS",
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
    "number": 24,
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
    "number": 25,
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
    "number": 26,
    "title": "Using Amazon Data Lifecycle Manager",
    "scenario": "An administrator needs to automate a backup and disaster recovery strategy for a fleet of production EC2 instances tagged with `AppName:WebApp`. The company policy dictates that daily snapshots must be created at 02:00 UTC. Snapshots in the primary region (`us-east-1`) must be retained for 30 days. For disaster recovery, these daily snapshots must also be copied to a secondary region (`eu-central-1`) where they must be retained for 180 days. This entire process must be automated with minimal operational overhead.",
    "questionText": "What is the most efficient and native method to implement this backup and DR plan?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create a DLM policy targeting the `AppName:WebApp` tag to create snapshots daily. Create a second DLM policy that targets snapshots with the same tag and configures a cross-region copy action."
      },
      {
        "letter": "B",
        "text": "Create a single DLM policy targeting resources with the `AppName:WebApp` tag. Within the policy's schedule, define the creation time, set the primary retention to 30 days, and add a cross-region copy action to `eu-central-1` with a separate retention period of 180 days."
      },
      {
        "letter": "C",
        "text": "Write an AWS Lambda function, triggered daily by an Amazon EventBridge schedule, that uses the AWS SDK to find the instances, create snapshots, copy them to the DR region, and manage retention by deleting old snapshots."
      },
      {
        "letter": "D",
        "text": "Use AWS Backup to create a backup plan. Define a backup rule for daily backups with a 30-day retention and a separate copy action to a vault in `eu-central-1` configured with a 180-day retention."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **Amazon Data Lifecycle Manager (DLM)** is designed for exactly this purpose for EBS snapshots. The most efficient implementation is a **single DLM policy** that handles the entire lifecycle. DLM allows you to define a schedule that not only creates the snapshot but also includes integrated actions like cross-region copy. Crucially, the cross-region copy action within the policy allows you to specify a completely separate retention period for the copied snapshots, meeting all requirements in one managed resource with minimal complexity.",
    "wrongExplanation": "Why the others are wrong: \n**A**: It is not possible to have a second DLM policy target snapshots created by the first. All actions (create, copy, retain) are defined within a single policy schedule. This approach is not functionally possible. \n**C**: While technically feasible, this is a significant amount of undifferentiated heavy lifting. It requires writing, testing, and maintaining custom code for a process that DLM handles natively. It is far from the most efficient solution. \n**D**: While AWS Backup can also achieve this, DLM is the more direct, EBS-centric service specifically for managing snapshot lifecycles. For an EBS-only workload as described, a single DLM policy is the most direct and streamlined implementation."
  },
  {
    "number": 27,
    "title": "Creating Backup and Data Recovery Plans",
    "scenario": "A company is using AWS Backup to manage backups for its Amazon RDS databases and Amazon EBS volumes in the `us-west-2` region. They have a disaster recovery (DR) requirement that all backups must be copied to a secondary region (`ap-southeast-1`) and retained there for one year. The original backups in `us-west-2` only need to be retained for 30 days. The process must be fully automated.",
    "questionText": "What is the most effective way to configure AWS Backup to meet these requirements?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Create a backup plan with two separate backup rules: one for a 30-day local backup and another for a 1-year cross-region copy."
      },
      {
        "letter": "B",
        "text": "Create a backup plan with a single backup rule. In the rule, set the lifecycle retention to 30 days and add a 'Copy to destination' action, specifying the destination region and a separate 1-year retention period for the copy."
      },
      {
        "letter": "C",
        "text": "Create a backup plan for the local backups. Configure an Amazon EventBridge rule to trigger a Lambda function on backup job completion, which then initiates a copy job to the DR region with the correct retention."
      },
      {
        "letter": "D",
        "text": "Create two separate backup vaults, one in each region. Configure the primary vault to automatically replicate all its recovery points to the secondary vault and manually set the retention on the replicated backups."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **AWS Backup** provides a comprehensive and integrated way to manage backup lifecycles, including cross-region copies for disaster recovery. The most efficient and intended method is to use a **single backup rule** within a backup plan. This rule allows you to define the lifecycle for the primary backup (30-day retention) and, within the same rule, add a **copy action**. This copy action lets you specify a destination region and vault, and crucially, allows you to configure a completely independent lifecycle for the copied recovery points (1-year retention). This centralizes the entire DR strategy into one easy-to-manage rule.",
    "wrongExplanation": "Why the others are wrong: \n**A**: A single backup plan can contain multiple rules, but the cross-region copy is an action *within* a rule, not a separate rule itself. This structure is incorrect. \n**C**: This is an overly complex, custom solution that re-implements functionality that AWS Backup provides natively. It introduces unnecessary operational overhead. \n**D**: While you can create vaults in different regions, the replication and lifecycle management is configured within the backup plan's rules, not as a property of the vault itself. The plan is the orchestrator."
  },
  {
    "number": 28,
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
    "number": 29,
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
    "number": 30,
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
    "number": 31,
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
    "number": 32,
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
    "number": 33,
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
    "number": 34,
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
    "number": 35,
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
    "number": 36,
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
    "number": 37,
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
    "number": 38,
    "title": "Building a Secure Amazon VPC",
    "scenario": "An architect is designing a new three-tier web application VPC. The design requires a public subnet for the web servers and a private subnet for the application servers. The application servers must be able to initiate connections to the internet to download software updates, but they must not be directly reachable from the internet. The solution must be highly available across two Availability Zones.",
    "questionText": "Which set of components correctly implements this secure and highly available network design?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "An Internet Gateway for the VPC. A public subnet with a route to the Internet Gateway. A private subnet with no route to the Internet Gateway. A single NAT Instance in the public subnet."
      },
      {
        "letter": "B",
        "text": "An Internet Gateway for the VPC. A public subnet in each AZ with a route to the Internet Gateway. A private subnet in each AZ. A NAT Gateway in each public subnet, and a route in each private subnet's route table pointing 0.0.0.0/0 to its respective NAT Gateway."
      },
      {
        "letter": "C",
        "text": "An Internet Gateway for the VPC. A public subnet with a route to the Internet Gateway. A private subnet with a route to the Internet Gateway, but with a Network ACL that denies all inbound traffic."
      },
      {
        "letter": "D",
        "text": "An egress-only Internet Gateway for the VPC. Public and private subnets in each AZ. A route in the private subnet's route table pointing to the egress-only Internet Gateway."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This describes the standard, highly available architecture for this pattern. An **Internet Gateway** provides connectivity for the VPC. **Public subnets** have a direct route to the IGW. For outbound-only access from private subnets, a **NAT Gateway** is required. To achieve high availability, a best practice is to deploy a NAT Gateway in **each Availability Zone's public subnet** and configure the route table for the private subnet *in that same AZ* to point its default route (`0.0.0.0/0`) to its local NAT Gateway. This prevents cross-AZ traffic for internet access and ensures the architecture can survive the failure of a single AZ.",
    "wrongExplanation": "Why the others are wrong: \n**A**: Using a single NAT Instance creates a single point of failure, violating the high availability requirement. \n**C**: Adding a route to the Internet Gateway in a private subnet effectively makes it a public subnet, regardless of the Network ACL. This is an insecure design. \n**D**: An egress-only Internet Gateway is for providing outbound-only access for IPv6 traffic, not for IPv4 traffic as is implied by the scenario."
  },
  {
    "number": 39,
    "title": "Establishing Secure Amazon VPC Connections",
    "scenario": "A company needs to establish a secure, private, and high-bandwidth connection between their on-premises data center and their AWS VPC in the `us-east-1` region. The connection will carry sensitive production traffic and must offer a consistent, low-latency network experience. The company wants to use a dedicated, private connection and avoid transmitting data over the public internet.",
    "questionText": "Which AWS service is the most appropriate choice to meet these requirements?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "AWS Site-to-Site VPN"
      },
      {
        "letter": "B",
        "text": "AWS Direct Connect"
      },
      {
        "letter": "C",
        "text": "VPC Peering"
      },
      {
        "letter": "D",
        "text": "AWS Client VPN"
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **AWS Direct Connect** is the service designed specifically for establishing a dedicated, private network connection from an on-premises location to AWS. It bypasses the public internet entirely, providing a more consistent network experience with lower latency and higher bandwidth options (from 50 Mbps to 100 Gbps) compared to internet-based connections. This makes it the ideal choice for sensitive, high-throughput production workloads that require a secure and reliable link between on-premises and AWS environments.",
    "wrongExplanation": "Why the others are wrong: \n**A**: AWS Site-to-Site VPN creates a secure connection, but it operates over the public internet, which can have variable performance and does not meet the requirement for a dedicated, private link. \n**C**: VPC Peering is for connecting two AWS VPCs together. It cannot be used to connect an on-premises data center to a VPC. \n**D**: AWS Client VPN is for connecting individual remote users (clients) to a VPC. It is not designed for creating a permanent, high-bandwidth link for an entire data center."
  },
  {
    "number": 40,
    "title": "Networking Beyond the VPC",
    "scenario": "A large enterprise has dozens of VPCs spread across multiple AWS accounts and regions. They need to build a central, hub-and-spoke network topology that allows any VPC to communicate with any other VPC through a central point of management and inspection. The solution must be scalable, managed, and support inter-region connectivity.",
    "questionText": "Which AWS networking service is designed to function as the hub in this global network topology?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "VPC Peering with a full-mesh configuration."
      },
      {
        "letter": "B",
        "text": "AWS Transit Gateway."
      },
      {
        "letter": "C",
        "text": "An EC2 instance in a central VPC acting as a software router."
      },
      {
        "letter": "D",
        "text": "AWS PrivateLink."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: **AWS Transit Gateway** is a managed service that acts as a cloud router, specifically designed to simplify network connectivity at scale. It allows you to connect thousands of VPCs and on-premises networks to a central hub. It supports inter-region peering, enabling you to build a global network. By routing all traffic through the Transit Gateway, you can centralize monitoring, management, and security inspection, perfectly matching the hub-and-spoke requirement.",
    "wrongExplanation": "Why the others are wrong: \n**A**: A full-mesh VPC peering configuration becomes exponentially complex and unmanageable as the number of VPCs grows. It does not provide a central point of control. \n**C**: Using a self-managed EC2 instance as a router introduces a single point of failure, has bandwidth limitations, and creates significant operational overhead for maintenance and scaling. \n**D**: AWS PrivateLink is for providing private, one-way connectivity from a consumer VPC to a specific service endpoint in a provider VPC. It is not for enabling full, routed, bi-directional network communication between VPCs."
  },
  {
    "number": 41,
    "title": "Using CloudFront to Improve Distribution",
    "scenario": "A company is using Amazon CloudFront to serve a dynamic web application hosted on an Application Load Balancer (ALB) in `us-east-1`. The application requires access to the end user's country of origin to display localized content. The company wants to implement this without modifying the backend application code. They also want to ensure that certain sensitive headers sent from the origin (e.g., internal debug headers) are never exposed to the end user.",
    "questionText": "Which two CloudFront features can be used in combination to add the country information to requests and remove sensitive headers from responses? (Choose two)",
    "isMultiChoice": true,
    "options": [
      {
        "letter": "A",
        "text": "A CloudFront cache policy"
      },
      {
        "letter": "B",
        "text": "A CloudFront origin request policy"
      },
      {
        "letter": "C",
        "text": "A CloudFront response headers policy"
      },
      {
        "letter": "D",
        "text": "Lambda@Edge"
      },
      {
        "letter": "E",
        "text": "CloudFront Functions"
      }
    ],
    "correctAnswers": ["B", "C"],
    "explanation": "Why B and C are correct: \nCloudFront Policies are the modern, efficient way to manage headers. **B** is correct because an **origin request policy** can be configured to forward specific headers to the origin. CloudFront automatically determines the viewer's location and can add standard headers like `CloudFront-Viewer-Country` to the request it sends to the origin (the ALB), making this data available to the application. **C** is correct because a **response headers policy** is used to modify the headers that CloudFront sends *back* to the viewer. You can configure it to remove specific headers (like custom debug headers) that were returned by the origin, ensuring they are stripped out before reaching the end user's browser.",
    "wrongExplanation": "Why the others are wrong: \n**A**: A cache policy is used to determine the cache key—i.e., what elements of a request are used to determine if an object is in the cache. It does not modify headers. \n**D**: While Lambda@Edge can perform these actions, it is a more complex and expensive solution. CloudFront Policies are the simpler, more cost-effective, and purpose-built feature for header manipulation. \n**E**: CloudFront Functions are for lightweight manipulations at the edge but cannot modify headers in the same way as policies and have more limitations than Lambda@Edge."
  },
  {
    "number": 42,
    "title": "Protecting Applications from Exploits and DDoS",
    "scenario": "A company's public-facing web application, fronted by an Application Load Balancer, is experiencing a series of attacks. The security team has identified two threats: 1) A volumetric UDP reflection attack targeting the ALB's IP addresses. 2) A series of HTTP requests containing patterns consistent with SQL injection and cross-site scripting (XSS) attacks. The company needs a managed, layered defense to mitigate both threats.",
    "questionText": "Which combination of AWS services provides the most effective defense against both of these attack vectors?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Amazon GuardDuty to detect the attacks and AWS WAF to block them."
      },
      {
        "letter": "B",
        "text": "AWS Shield Standard for the UDP reflection attack and AWS WAF with Managed Rules for the SQL injection and XSS attacks."
      },
      {
        "letter": "C",
        "text": "Network ACLs to block the UDP attack and AWS Shield Advanced for the SQL injection attacks."
      },
      {
        "letter": "D",
        "text": "AWS Firewall Manager to deploy AWS WAF rules across all accounts."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This requires a layered security approach using the correct tool for each layer. **AWS Shield Standard** is automatically enabled for all customers and provides protection against common, volumetric Layer 3/4 DDoS attacks, such as UDP reflection attacks. This handles the first threat. For the second threat, **AWS WAF** is the web application firewall service designed to protect against Layer 7 attacks. By attaching a Web ACL to the ALB and enabling the AWS **Managed Rules** for SQL injection and cross-site scripting, you get a powerful, managed defense against these common application exploits. This combination correctly addresses both the network-layer and application-layer attacks.",
    "wrongExplanation": "Why the others are wrong: \n**A**: GuardDuty is a threat *detection* service, not a mitigation service. It can identify that an attack is happening but cannot block it. \n**C**: Network ACLs are stateless and difficult to manage for dynamic DDoS attacks. Shield Advanced is a DDoS service, but WAF is the primary tool for blocking specific exploit patterns like SQLi. \n**D**: Firewall Manager is for centrally deploying and managing WAF rules; it is a management tool, not the protection service itself."
  },
  {
    "number": 43,
    "title": "Securing Communications with AWS Certificate Manager",
    "scenario": "A company is deploying a new public-facing web application using Amazon CloudFront and an Application Load Balancer (ALB). They need to secure all communication with clients using HTTPS. The solution must use a publicly trusted SSL/TLS certificate, and the certificate's renewal process must be fully automated to avoid service interruptions due to expiration. The company owns the domain `example.com`.",
    "questionText": "What is the most efficient and secure way to provision and manage the SSL/TLS certificate for this setup?",
    "isMultiChoice": false,
    "options": [
      {
        "letter": "A",
        "text": "Purchase a certificate from a third-party Certificate Authority (CA), manually upload it to AWS Certificate Manager (ACM), and attach it to the CloudFront distribution."
      },
      {
        "letter": "B",
        "text": "Use ACM to request a public certificate for `*.example.com`. Validate domain ownership using DNS validation with Route 53. Associate the ACM certificate with the CloudFront distribution in the `us-east-1` region."
      },
      {
        "letter": "C",
        "text": "Generate a self-signed certificate using OpenSSL, import it into ACM, and associate it with the Application Load Balancer."
      },
      {
        "letter": "D",
        "text": "Use ACM to request a private certificate from a private CA and associate it with the CloudFront distribution."
      }
    ],
    "correctAnswers": ["B"],
    "explanation": "Why B is correct: This is the standard, best-practice approach. **AWS Certificate Manager (ACM)** can provision public SSL/TLS certificates at no cost. Using **DNS validation**, especially when your domain is managed by Route 53, allows ACM to automatically add the required validation record, proving domain ownership. The key benefit is that ACM will then manage the **automated renewal** of the certificate before it expires, ensuring there is no manual intervention required. For use with a global service like **CloudFront**, the certificate *must* be requested in the **`us-east-1` (N. Virginia) region**. This combination is secure, automated, and cost-effective.",
    "wrongExplanation": "Why the others are wrong: \n**A**: This is a manual process. It requires purchasing a certificate and, most importantly, remembering to manually renew and re-upload it before it expires, which is error-prone. \n**C**: Self-signed certificates are not trusted by browsers and will result in security warnings for users. They are not suitable for public-facing applications. \n**D**: Private certificates are for internal use cases (like mTLS between services within a VPC) and are not trusted by public browsers."
  }
]
