class AccessPolicy
  include AccessGranted::Policy

  def configure
    role :admin, proc {|user| user.admin? } do
      can %i[read update], Agent
      can :manage, AlarmRule
      can :read, Log
      can :read, Alarm
    end

    role :operator, proc {|user| user.operater? } do
      can :read, Log
      can :read, Alarm
    end
  end
end
